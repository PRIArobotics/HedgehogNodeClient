
import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import zmq = require('zmq');
import {wrapCallbackAsPromise} from "../utils";


let sock = zmq.socket('pub');


export default class Motor {
    public MotorState;
    private MotorAction;
    private MotorRequest;
    private MotorUpdate;
    private MotorStateUpdate;
    private MotorSetPositionAction;

    public async init() {
        let builder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile, "proto/hedgehog/protocol/proto/motor.proto");

        this.MotorState = builder.build("hedgehog.protocol.proto.MotorState");
        this.MotorAction = builder.build("hedgehog.protocol.proto.MotorAction");
        this.MotorRequest = builder.build('hedgehog.protocol.proto.MotorRequest');
        this.MotorUpdate = builder.build("hedgehog.protocol.proto.MotorUpdate");
        this.MotorStateUpdate = builder.build("hedgehog.protocol.proto.MotorStateUpdate");
        this.MotorSetPositionAction = builder.build("hedgehog.protocol.proto.MotorSetPositionAction");
    }

    public parseAction(port: number, state: number, amount: number = 0, relative?: number,
                       absolute?: number, reachedState: number = this.MotorState.POWER) {

        if(relative != null && absolute != null) {
            throw new TypeError("relative and absolute are mutually exclusive");
        }

        if( (relative == null || relative === undefined) && (absolute == null || absolute === undefined)) {
            if(reachedState !== 0) {
                throw new TypeError(
                    "reached_state must be kept at its default value for non-positional motor commands");
            }
        }


        let motorAction = new this.MotorAction({
            port,
            state,
            amount,
            reached_state: reachedState,
        });

        if(relative != null) motorAction.relative = relative;
        if(absolute != null) motorAction.absolute = absolute;

        return motorAction;
    }

    public parseRequest(port: number) {
        return new this.MotorRequest({
            port
        });
    }

    public parseUpdate(port: number, velocity: number, position: number) {
        return new this.MotorUpdate({
            port,
            velocity,
            position
        });
    }

    public parseStateUpdate(port: number, state: number) {
        return new this.MotorStateUpdate({
            port,
            state
        });
    }

    public parseSetPositionAction(port: number, position: number) {
        return new this.MotorSetPositionAction({
            port,
            position
        });
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}
