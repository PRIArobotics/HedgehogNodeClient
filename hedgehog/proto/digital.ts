import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import {wrapCallbackAsPromise} from "../utils";


export default class Digital {
    private DigitalRequest;
    private DigitalUpdate;

    public async init() {
        let builder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile, "proto/hedgehog/protocol/proto/io.proto");

        this.DigitalRequest = builder.build("hedgehog.protocol.proto.DigitalRequest");
        this.DigitalUpdate = builder.build("hedgehog.protocol.proto.DigitalUpdate");
    }

    public parseDigitalRequest(port: number) {
        console.log(this.DigitalRequest);

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
