import "babel-polyfill";

import ProtoBuf = require("protobufjs");


export default class Servo {
    private ServoAction;

    constructor() {
        let builder = ProtoBuf.loadProtoFile("proto/hedgehog/protocol/proto/servo.proto");

        this.ServoAction = builder.build("hedgehog.protocol.proto.ServoAction");
    }

    public parseServoAction(port: number, active: boolean, position: number) {
        return new this.ServoAction({
            port,
            active,
            position
        });
    }
}
