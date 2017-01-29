/**
 * Created by tfellner on 30.11.16.
 */

import zmq = require('zmq');

import {Message} from '../proto/hedgehog';
import {Action as MotorAction, MotorState, SetPositionAction as MotorSetPositionAction, Request as MotorRequest} from '../proto/motor';
import {Action as ServoAction} from '../proto/servo';
import {DigitalRequest} from '../proto/digital';
import {AnalogUpdate, AnalogRequest} from '../proto/analog';
import {StateAction, IOStateFlags} from '../proto/io';
let Acknowledgement = require('../protocol/proto/ack_pb').Acknowledgement;
let DigitalUpdate = require('../protocol/proto/io_pb').DigitalUpdate;
let HedgehogMessage = require('../protocol/proto/hedgehog_pb').HedgehogMessage;

let socket = zmq.socket('dealer');

export class HedgehogClient {
    public endpoint: string;
    private callbacks: Map<string, {resolve, reject}>;

    constructor (endpoint: string = 'tcp://127.0.0.1:10789') {
        this.endpoint = endpoint;

        socket.connect(this.endpoint);

        socket.on('message', (data) => {
            try {
                let hedgehogMessage = HedgehogMessage.deserializeBinary(new Uint8Array(data));

                if (hedgehogMessage.getDigitalUpdate()) {
                    let digitalUpdate = hedgehogMessage.getDigitalUpdate();
                    let callback = this.callbacks.get('get_digital_' + digitalUpdate.getPort());
                    if (callback) {
                        callback.resolve(digitalUpdate);
                    }
                } else if (hedgehogMessage.getAnalogUpdate()) {
                    let analogUpdate = hedgehogMessage.getAnalogUpdate();
                    let callback = this.callbacks.get('get_analog_' + analogUpdate.getPort());
                    if (callback) {
                        callback.resolve(analogUpdate);
                    }
                } else if (hedgehogMessage.getMotorUpdate()) {
                    let motorUpdate = hedgehogMessage.getMotorUpdate();
                    let callback = this.callbacks.get('get_motor_' + motorUpdate.getPort());
                    if (callback) {
                        callback.resolve(motorUpdate);
                    }
                } else if (hedgehogMessage.getMotorStateUpdate()) {
                    let motorStateUpdate = hedgehogMessage.getMotorStateUpdate();
                    let callback = this.callbacks.get('get_motor_' + motorStateUpdate.getPort());
                    if (callback) {
                        callback.resolve(motorStateUpdate);
                    }
                } else if (hedgehogMessage.getMotorStateUpdate()) {
                    let motorStateUpdate = hedgehogMessage.getMotorStateUpdate();
                    let callback = this.callbacks.get('get_motor_' + motorStateUpdate.getPort());
                    if (callback) {
                        callback.resolve(motorStateUpdate);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    public sendHedgehogMessage (message) {
        let hedgehogMessage = new Message(message.parse()).parse().serializeBinary();
        socket.send(['', Buffer.from(hedgehogMessage)]);
    }

    public set_input_state(port: number, pullup) {
        this.sendHedgehogMessage(new StateAction(port, pullup ?
            IOStateFlags.INPUT_PULLUP : IOStateFlags.INPUT_FLOATING));
    }

    public get_analog(port) {
        return new Promise((resolve, reject) => {
            this.sendHedgehogMessage(new AnalogRequest(port));

            this.callbacks.set('get_analog_' + port, {
                resolve,
                reject
            });
        });

    }
    public get_digital(port) {
        return new Promise((resolve, reject) => {
            this.sendHedgehogMessage(new DigitalRequest(port));

            this.callbacks.set('get_digital_' + port, {
                resolve,
                reject
            });
        });
    }

    public set_digital_output(port: number, level) {
        this.sendHedgehogMessage(new StateAction(port, level ? IOStateFlags.OUTPUT_ON : IOStateFlags.OUTPUT_OFF));
    }

    public set_motor(port: number, state: number, amount: number=0,
                     reachedState: number=MotorState.POWER, relative: number=null,
                     absolute: number=null, onReached: number=null) {
        if(onReached) {
            if (!relative && !absolute) {
                throw TypeError("callback given, but no end position");
            }
        }
        this.sendHedgehogMessage(new MotorAction(port, state, amount, reachedState, relative, absolute));
    }

    public move(port: number, amount: number, state: number=MotorState.POWER) {
        this.set_motor(port, state, amount);
    }

    public move_relative_position(port: number, amount: number, relative: number,
                                  state: number=MotorState.POWER, onReached: number=null) {
        this.set_motor(port, state, amount, null, relative, onReached);
    }

    public move_absolute_position(port: number, amount: number, absolute: number,
                                  state: number=MotorState.POWER, onReached: number=null) {
        this.set_motor(port, state, amount, null, absolute, onReached);
    }

    public get_motor(port) {
        return new Promise((resolve, reject) => {
            this.sendHedgehogMessage(new MotorRequest(port));

            this.callbacks.set('get_motor_' + port, {
                resolve,
                reject
            });
        });
    }

    public async get_motor_velocity(port) {
        let motor: any = await this.get_motor(port);
        return motor.getVelocity();
    }

    public set_motor_position(port: number, position: number) {
        this.sendHedgehogMessage(new MotorSetPositionAction(port, position));
    }

    public set_servo(port: number, active: boolean, position: number) {
        this.sendHedgehogMessage(new ServoAction(port, active, position));
    }

    public close () {
        socket.close();
    }
}
