import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import {wrapCallbackAsPromise} from "../utils";


export default class Ack {
    public AcknowledgementCode;
    private Acknowledgement;

    public async init() {
        let builder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile, "proto/hedgehog/protocol/proto/ack.proto");

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
