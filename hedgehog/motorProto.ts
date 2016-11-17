
import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import zmq = require('zmq');


let sock = zmq.socket('pub');


export class MotorProto {
    private MotorState;
    private MotorAction;
    private MotorRequest;
    private MotorUpdate;
    private MotorStateUpdate;
    private MotorSetPositionAction;

    constructor() {
        let builder = ProtoBuf.loadProtoFile('proto/hedgehog/protocol/proto/motor.proto');

        this.MotorState = builder.build("hedgehog.protocol.proto.MotorState");
        this.MotorAction = builder.build("hedgehog.protocol.proto.MotorAction");
        this.MotorRequest = builder.build('hedgehog.protocol.proto.MotorRequest');
        this.MotorUpdate = builder.build("hedgehog.protocol.proto.MotorUpdate");
        this.MotorStateUpdate = builder.build("hedgehog.protocol.proto.MotorStateUpdate");
        this.MotorSetPositionAction = builder.build("hedgehog.protocol.proto.MotorSetPositionAction");
    }

    public parseAction(port: number, state: number, amount: number = 0,
                       reachedState: number = this.MotorState.POWER, relative?: number, absolute?: number) {

        let motorAction = new this.MotorAction({
            port,
            state,
            amount,
            reached_state: reachedState,
        });

        if(relative == null) motorAction.relative = relative;
        if(absolute == null) motorAction.absolute = absolute;
    }

    public seriailzeAction(action) {
        let buffer = action.encode();
        return buffer.toArrayBuffer();
    }
}
