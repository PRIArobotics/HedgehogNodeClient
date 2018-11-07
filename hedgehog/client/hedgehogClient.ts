/**
 * Created by tfellner on 30.11.16.
 */

import { Message, RequestMsg, ReplyMsg } from '../protocol/messages/index';
import * as ack from '../protocol/messages/ack';
import * as io from '../protocol/messages/io';
import * as analog from '../protocol/messages/analog';
import * as digital from '../protocol/messages/digital';
import * as motor from '../protocol/messages/motor';
import * as servo from '../protocol/messages/servo';
import * as process from '../protocol/messages/process';

export { AcknowledgementCode } from '../protocol/messages/ack';
export { IOFlags } from '../protocol/messages/io';
export { MotorState } from '../protocol/messages/motor';
export { ProcessFileno } from '../protocol/messages/process';

import zmq = require('zeromq');

interface CommandHandler<T> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export class HedgehogClient {
    private socket = zmq.socket('dealer');
    private commandQueue: Array<CommandHandler<Message[]>> = [];

    constructor (public endpoint: string = 'tcp://127.0.0.1:10789') {
        this.socket.connect(this.endpoint);

        this.socket.on('message', (delimiter, ...data) => {
            setTimeout(() => {
                let msgs = data.map(msg => ReplyMsg.parse(msg));
                // TODO check whether msgs contains asynchronous updates
                this.commandQueue.shift().resolve(msgs);
            }, 0);
        });
    }

    public async send<T extends Message>(msg: Message): Promise<T> {
        let reply = (await this.sendMultipart(msg))[0];
        if(reply instanceof ack.Acknowledgement && reply.code !== ack.AcknowledgementCode.OK) {
            // TODO throw error
            return null;
        }
        return reply as T;
    }

    public sendMultipart(...msgs: Message[]): Promise<Message[]> {
        return new Promise((resolve, reject) => {
            let msgsRaw: Array<string | Buffer> = [''];
            msgsRaw.push(...msgs.map(msg => Buffer.from(RequestMsg.serialize(msg) as any)));

            this.socket.send(msgsRaw);
            this.commandQueue.push({ resolve, reject });
        });
    }

    public async setInputState(port: number, pullup: boolean): Promise<void> {
        await this.send(new io.Action(port, pullup? io.IOFlags.INPUT_PULLUP : io.IOFlags.INPUT_FLOATING));
    }

    public async getAnalog(port: number): Promise<number> {
        let reply = await this.send<analog.Reply>(new analog.Request(port));
        return reply.value;
    }

    public async getDigital(port: number): Promise<boolean> {
        let reply = await this.send<digital.Reply>(new digital.Request(port));
        return reply.value;
    }

    public async setDigitalOutput(port: number, level: boolean): Promise<void> {
        await this.send(new io.Action(port, level? io.IOFlags.OUTPUT_ON : io.IOFlags.OUTPUT_OFF));
    }

    public async getIOConfig(port: number): Promise<number> {
        let reply = await this.send<io.CommandReply>(new io.CommandRequest(port));
        return reply.flags;
    }

    public async setMotor(port: number, state: number, amount: number = 0,
                          reachedState: number = motor.MotorState.POWER,
                          relative?: number, absolute?: number): Promise<void> {
        await this.send(new motor.Action(port, state, amount, reachedState, relative, absolute));
    }

    public async move(port: number, amount: number, state: number = motor.MotorState.POWER): Promise<void> {
        await this.setMotor(port, state, amount);
    }

    public async moveRelativePosition(port: number, amount: number, relative: number,
                                      state: number = motor.MotorState.POWER,
                                      reachedState: number = motor.MotorState.POWER): Promise<void> {
        await this.setMotor(port, state, amount, reachedState, relative, undefined);
    }

    public async moveAbsolutePosition(port: number, amount: number, absolute: number,
                                      state: number = motor.MotorState.POWER,
                                      reachedState: number = motor.MotorState.POWER): Promise<void> {
        await this.setMotor(port, state, amount, reachedState, undefined, absolute);
    }

    public async getMotorCommand(port: number): Promise<[number, number]> {
        let reply = await this.send<motor.CommandReply>(new motor.CommandRequest(port));
        return [reply.state, reply.amount];
    }

    public async getMotorState(port: number): Promise<[number, number]> {
        let reply = await this.send<motor.StateReply>(new motor.StateRequest(port));
        return [reply.velocity, reply.position];
    }

    public async getMotorVelocity(port: number): Promise<number> {
        let [velocity, _] = await this.getMotorState(port);
        return velocity;
    }

    public async getMotorPosition(port: number): Promise<number> {
        let [_, position] = await this.getMotorState(port);
        return position;
    }

    public async setMotorPosition(port: number, position: number): Promise<void> {
        await this.send(new motor.SetPositionAction(port, position));
    }

    public async setServo(port: number, active: boolean, position?: number): Promise<void> {
        await this.send(new servo.Action(port, active, position));
    }

    public async getServoCommand(port: number): Promise<[boolean, number]> {
        let reply = await this.send<servo.CommandReply>(new servo.CommandRequest(port));
        return [reply.active, reply.position];
    }

    public close () {
        this.socket.close();
    }
}
