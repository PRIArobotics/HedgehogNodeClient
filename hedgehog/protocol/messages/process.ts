// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let process_pb: any = require('../proto/process_pb');

// <GSL customizable: module-header>
export let ProcessFileno = process_pb.ProcessFileno;
// </GSL customizable: module-header>

@RequestMsg.message(process_pb.ProcessExecuteAction, PayloadCase.PROCESS_EXECUTE_ACTION)
export class ExecuteAction extends Message {
    constructor(public args: string[], public workingDir?: string) {
        super();
    }

    // <default GSL customizable: ExecuteAction-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessExecuteAction();
        let args = msg.getArgsList();
        let workingDir = msg.getWorkingDir();
        return new ExecuteAction(args, workingDir);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExecuteAction();
        msg.setArgsList(this.args);
        msg.setWorkingDir(this.workingDir);
        (<any> containerMsg).setProcessExecuteAction(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessExecuteReply, PayloadCase.PROCESS_EXECUTE_REPLY)
export class ExecuteReply extends Message {
    constructor(public pid: number) {
        super();
    }

    // <default GSL customizable: ExecuteReply-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessExecuteReply();
        let pid = msg.getPid();
        return new ExecuteReply(pid);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExecuteReply();
        msg.setPid(this.pid);
        (<any> containerMsg).setProcessExecuteReply(msg);
    }
}

@RequestMsg.message(process_pb.ProcessStreamMessage, PayloadCase.PROCESS_STREAM_MESSAGE)
export class StreamAction extends Message {
    constructor(public pid: number, public fileno: number, public chunk?: Uint8Array) {
        super();
        if(chunk && chunk.length === 0)
            this.chunk = undefined;
    }

    // <default GSL customizable: StreamAction-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessStreamMessage();
        let pid = msg.getPid();
        let fileno = msg.getFileno();
        let chunk = Uint8Array.from(msg.getChunk());
        return new StreamAction(pid, fileno, chunk);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessStreamMessage();
        msg.setPid(this.pid);
        msg.setFileno(this.fileno);
        msg.setChunk(this.chunk);
        (<any> containerMsg).setProcessStreamMessage(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessStreamMessage, PayloadCase.PROCESS_STREAM_MESSAGE)
export class StreamUpdate extends Message {
    isAsync = true;

    constructor(public pid: number, public fileno: number, public chunk?: Uint8Array) {
        super();
        if(chunk && chunk.length === 0)
            this.chunk = undefined;
    }

    // <default GSL customizable: StreamUpdate-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessStreamMessage();
        let pid = msg.getPid();
        let fileno = msg.getFileno();
        let chunk = Uint8Array.from(msg.getChunk());
        return new StreamUpdate(pid, fileno, chunk);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessStreamMessage();
        msg.setPid(this.pid);
        msg.setFileno(this.fileno);
        msg.setChunk(this.chunk);
        (<any> containerMsg).setProcessStreamMessage(msg);
    }
}

@RequestMsg.message(process_pb.ProcessSignalAction, PayloadCase.PROCESS_SIGNAL_ACTION)
export class SignalAction extends Message {
    constructor(public pid: number, public signal: number) {
        super();
    }

    // <default GSL customizable: SignalAction-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessSignalAction();
        let pid = msg.getPid();
        let signal = msg.getSignal();
        return new SignalAction(pid, signal);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessSignalAction();
        msg.setPid(this.pid);
        msg.setSignal(this.signal);
        (<any> containerMsg).setProcessSignalAction(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessExitUpdate, PayloadCase.PROCESS_EXIT_UPDATE)
export class ExitUpdate extends Message {
    isAsync = true;

    constructor(public pid: number, public exitCode: number) {
        super();
    }

    // <default GSL customizable: ExitUpdate-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getProcessExitUpdate();
        let pid = msg.getPid();
        let exitCode = msg.getExitCode();
        return new ExitUpdate(pid, exitCode);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExitUpdate();
        msg.setPid(this.pid);
        msg.setExitCode(this.exitCode);
        (<any> containerMsg).setProcessExitUpdate(msg);
    }
}
