import "babel-polyfill";

import ProtoBuf = require("protobufjs");


export default class Ack {
    public AcknowledgementCode;
    private Acknowledgement;

    constructor() {
        let builder = ProtoBuf.loadProtoFile("proto/hedgehog/protocol/proto/ack.proto");

        this.AcknowledgementCode = builder.build("hedgehog.protocol.proto.AcknowledgementCode");
        this.Acknowledgement = builder.build("hedgehog.protocol.proto.Acknowledgement");
    }

    public parseAcknowledgement(code: number = this.AcknowledgementCode.OK, message: string) {
        return new this.Acknowledgement({
            code,
            message
        });
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}
