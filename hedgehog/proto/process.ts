import "babel-polyfill";

let process: any = require('../protocol/proto/process_pb');
export let ProcessFileno = process.ProcessFileno;

export class ExecuteRequest {
    public args: string[];
    public workingDir: string;

    constructor(args: string[], workingDir: number = null) {
        this.args = args;
    }

    public parse() {
        let executeRequest = new process.ExecuteRequest();
        executeRequest.setArgsList(this.args);
        executeRequest.setWorkingDir(this.workingDir);

        return executeRequest;
    }
}

export class ExecuteReply {
    public pid: number;

    constructor(pid: number) {
        this.pid = pid;
    }

    public parse() {
        let executeReply = new process.ExecuteReply();
        executeReply.setPid(this.pid);

        return executeReply;
    }
}

export class StreamAction {
    public pid: number;
    public fileno: any;
    public chunk: Uint8Array;

    constructor(pid: number, fileno: any, chunk: Uint8Array = new Uint8Array(0)) {
        this.pid = pid;
        this.fileno = fileno;
        this.chunk = chunk;
    }

    public parse() {
        let streamAction = new process.StreamAction();
        streamAction.setPid(this.pid);
        streamAction.setFileno(this.fileno);
        streamAction.setChunk(this.chunk);

        return streamAction;
    }
}

export class StreamUpdate {
    public pid: number;
    public fileno: any;
    public chunk: Uint8Array;

    constructor(pid: number, fileno: any, chunk: Uint8Array = new Uint8Array(0)) {
        this.pid = pid;
        this.fileno = fileno;
        this.chunk = chunk;
    }

    public parse() {
        let streamUpdate = new process.StreamUpdate();
        streamUpdate.setPid(this.pid);
        streamUpdate.setFileno(this.fileno);
        streamUpdate.setChunk(this.chunk);

        return streamUpdate;
    }
}

export class ExitUpdate {
    public pid: number;
    public exitCode: number;

    constructor(pid: number, exitCode: number) {
        this.pid = pid;
        this.exitCode = exitCode;
    }

    public parse() {
        let exitUpdate = new process.ExitUpdate();
        exitUpdate.setPid(this.pid);
        exitUpdate.setExitCode(this.exitCode);

        return exitUpdate;
    }
}
