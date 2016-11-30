import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import {wrapCallbackAsPromise} from "../utils";

export default class Hedgehog {
    private HedgehogMessage;

    public async init() {

        let ackBuilder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/ack.proto");

        let builder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/hedgehog.proto");

        let ioBuilder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/io.proto");

        let motorBuilder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/motor.proto");

        let processBuilder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/process.proto");

        let servoBuilder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile,
            "proto/hedgehog/protocol/proto/servo.proto");

        this.HedgehogMessage = builder.build("hedgehog.protocol.proto.HedgehogMessage");
    }

    public parseHedgehogMessage(message) {
        console.log(typeof message);

        /*
        new this.HedgehogMessage({

        })*/
    }
}
