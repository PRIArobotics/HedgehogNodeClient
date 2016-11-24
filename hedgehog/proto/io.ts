import "babel-polyfill";

import ProtoBuf = require("protobufjs");
import {wrapCallbackAsPromise} from "../utils";


export default class Io {
    public IOStateFlags;
    private IOStateAction;

    public async init() {
        let builder = await wrapCallbackAsPromise(ProtoBuf.loadProtoFile, "proto/hedgehog/protocol/proto/io.proto");

        this.IOStateFlags = builder.build("hedgehog.protocol.proto.IOStateFlags");
        this.IOStateAction = builder.build("hedgehog.protocol.proto.IOStateAction");
    }

    public parseStateAction(port: number, flags: any) {
        if(flags & this.IOStateFlags.OUTPUT && flags & (this.IOStateFlags.PULLUP | this.IOStateFlags.PULLDOWN)) {
            throw new TypeError("only input ports can be set to pullup or pulldown");
        }

        if( !(flags & this.IOStateFlags.OUTPUT) && flags & this.IOStateFlags.LEVEL) {
            throw new TypeError("only output ports can be set to on");
        }

        if(flags & this.IOStateFlags.PULLUP && flags & this.IOStateFlags.PULLDOWN) {
            throw new TypeError("pullup and pulldown are mutually exclusive");
        }

        return new this.IOStateAction({
            port,
            flags
        });
    }

    public output(ioStateAction) {
        return (ioStateAction.flags & this.IOStateFlags.OUTPUT) !== 0;
    }

    public pullup(ioStateAction) {
        return (ioStateAction.flags & this.IOStateFlags.PULLUP) !== 0;
    }

    public pulldown(ioStateAction) {
        return (ioStateAction.flags & this.IOStateFlags.PULLDOWN) !== 0;
    }

    public level(ioStateAction) {
        return (ioStateAction.flags & this.IOStateFlags.LEVEL) !== 0;
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}
