import "babel-polyfill";

import ProtoBuf = require("protobufjs");


export default class Analog {
    private AnalogRequest;
    private AnalogUpdate;

    constructor() {
        let builder = ProtoBuf.loadProtoFile("proto/hedgehog/protocol/proto/io.proto");

        this.AnalogRequest = builder.build("hedgehog.protocol.proto.AnalogRequest");
        this.AnalogUpdate = builder.build("hedgehog.protocol.proto.AnalogUpdate");
    }

    public parseAnalogRequest(port: number) {
        return new this.AnalogRequest({
            port
        });
    }

    public parseAnalogUpdate(port: number, value: number) {
        return new this.AnalogUpdate({
            port,
            value
        });
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}