import "babel-polyfill";

import ProtoBuf = require("protobufjs");


export default class Digital {
    private DigitalRequest;
    private DigitalUpdate;

    constructor() {
        let builder = ProtoBuf.loadProtoFile("proto/hedgehog/protocol/proto/io.proto");

        this.DigitalRequest = builder.build("hedgehog.protocol.proto.DigitalRequest");
        this.DigitalUpdate = builder.build("hedgehog.protocol.proto.DigitalUpdate");
    }

    public parseDigitalRequest(port: number) {
        return new this.DigitalRequest({
            port
        });
    }

    public parseDigitalUpdate(port: number, value: boolean) {
        return new this.DigitalUpdate({
            port,
            value
        });
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}
