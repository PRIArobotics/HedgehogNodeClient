/**
 * Created by tfellner on 30.11.16.
 */

import { RequestMsg, ReplyMsg, Message,
         ack, version, emergency, io, analog, digital, motor, servo, imu, process } from '../protocol';

export { AcknowledgementCode } from '../protocol/messages/ack';
export { IOFlags } from '../protocol/messages/io';
export { MotorState } from '../protocol/messages/motor';
export { ProcessFileno } from '../protocol/messages/process';

import * as zmq from 'zeromq';

interface CommandHandler<T> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export interface VersionInfo {
    ucId: Uint8Array;
    hardwareVersion: string;
    firmwareVersion: string;
    serverVersion: string;
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

    public async getVersion(): Promise<VersionInfo> {
        let {
            ucId, hardwareVersion, firmwareVersion, serverVersion,
        } = await this.send<version.Reply>(new version.Request());
        return {ucId, hardwareVersion, firmwareVersion, serverVersion};
    }

    public async setEmergencyStop(activate: boolean): Promise<void> {
        await this.send(new emergency.Action(activate));
    }

    public async getEmergencyStop(port: number): Promise<boolean> {
        let reply = await this.send<emergency.Reply>(new emergency.Request());
        return reply.active;
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

    public async configureMotor(port: number, config: motor.MotorConfig): Promise<void> {
        await this.send(new motor.ConfigAction(port, config));
    }

    public async configureMotorDc(port: number): Promise<void> {
        await this.configureMotor(port, {kind: motor.ConfigKind.DC});
    }

    public async configureMotorEncoder(port: number, encoderAPort: number, encoderBPort: number): Promise<void> {
        await this.configureMotor(port, {kind: motor.ConfigKind.ENCODER, encoderAPort, encoderBPort});
    }

    public async configureMotorStepper(port: number): Promise<void> {
        await this.configureMotor(port, {kind: motor.ConfigKind.STEPPER});
    }

    public async moveMotor(port: number, amount: number, state: number = motor.MotorState.POWER): Promise<void> {
        await this.send(new motor.Action(port, state, amount));
    }

    public async motorOff(port: number): Promise<void> {
        await this.moveMotor(port, 0, motor.MotorState.POWER);
    }

    public async brake(port: number): Promise<void> {
        await this.moveMotor(port, 1000, motor.MotorState.BRAKE);
    }

    public async moveRelativePosition(port: number, amount: number, relative: number,
                                      state: number = motor.MotorState.POWER,
                                      reachedState: number = motor.MotorState.POWER): Promise<void> {
        await this.send(new motor.Action(port, state, amount, reachedState, relative, undefined));
    }

    public async moveAbsolutePosition(port: number, amount: number, absolute: number,
                                      state: number = motor.MotorState.POWER,
                                      reachedState: number = motor.MotorState.POWER): Promise<void> {
        await this.send(new motor.Action(port, state, amount, reachedState, undefined, absolute));
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

    public async setServo(port: number, position: number | null): Promise<void> {
        if (position !== null) {
            // position is in range 0..1000 but must be in range 1000..5000
            position = 1000 + 4 * position;
        }
        await this.setServoRaw(port, position);
    }

    public async setServoRaw(port: number, position: number | null): Promise<void> {
        // position is in range 1000..5000, which is the duty cycle length in 0.5us units
        await this.send(new servo.Action(port, position));
    }

    public async getServoPosition(port: number): Promise<number | null> {
        let position = await this.getServoPositionRaw(port);
        if (position !== null) {
            position = Math.floor((position - 1000) / 4);
        }
        return position;
    }

    public async getServoPositionRaw(port: number): Promise<number | null> {
        let reply = await this.send<servo.CommandReply>(new servo.CommandRequest(port));
        return reply.position;
    }

    public async getImuRate(): Promise<[number, number, number]> {
        let reply = await this.send<imu.RateReply>(new imu.RateRequest());
        return [reply.x, reply.y, reply.z];
    }

    public async getImuAcceleration(): Promise<[number, number, number]> {
        let reply = await this.send<imu.AccelerationReply>(new imu.AccelerationRequest());
        return [reply.x, reply.y, reply.z];
    }

    public async getImuPose(): Promise<[number, number, number]> {
        let reply = await this.send<imu.PoseReply>(new imu.PoseRequest());
        return [reply.x, reply.y, reply.z];
    }

    public close () {
        this.socket.close();
    }
}
