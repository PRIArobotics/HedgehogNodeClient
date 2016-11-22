import "babel-polyfill";

import ProtoBuf = require("protobufjs");

export default class Process {
    public ProcessFileno;
    private ProcessExecuteRequest;
    private ProcessExecuteReply;
    private ProcessStreamAction;
    private ProcessStreamUpdate;
    private ProcessExitUpdate;

    constructor() {
        let builder = ProtoBuf.loadProtoFile("proto/hedgehog/protocol/proto/process.proto");

        this.ProcessExecuteRequest = builder.build("hedgehog.protocol.proto.ProcessFileno");
        this.ProcessExecuteRequest = builder.build("hedgehog.protocol.proto.ProcessExecuteRequest");
        this.ProcessExecuteReply = builder.build("hedgehog.protocol.proto.ProcessExecuteReply");
        this.ProcessStreamAction = builder.build("hedgehog.protocol.proto.ProcessStreamAction");
        this.ProcessStreamUpdate = builder.build("hedgehog.protocol.proto.ProcessStreamUpdate");
        this.ProcessExitUpdate = builder.build("hedgehog.protocol.proto.ProcessExitUpdate");
    }

    public parseExecuteRequest(args: string[], workingDir: number) {
        let processExecuteRequest = new this.ProcessExecuteRequest({
            working_dir: workingDir
        });

        processExecuteRequest.args.push(args);

        return processExecuteRequest;
    }

    public parseExecuteReply(pid: number) {
        return new this.ProcessExecuteReply({
            pid
        });
    }

    public parseStreamAction(pid: number, fileno: any, chunk: Uint8Array) {
        return new this.ProcessStreamAction({
            pid,
            fileno,
            chunk
        });
    }

    public parseStreamUpdate(pid: number, fileno: any, chunk: Buffer) {
        return new this.ProcessStreamUpdate({
            pid,
            fileno,
            chunk
        });
    }

    public parseExitUpdate(pid: number, ExitCode: number) {
        return new this.ProcessExitUpdate({
            pid,
            exit_code: ExitCode
        });
    }

    public serialize(message) {
        let buffer = message.encode();
        return buffer.toArrayBuffer();
    }
}
