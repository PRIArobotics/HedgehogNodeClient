import "babel-polyfill";

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let process_pb: any = require('../proto/process_pb');

export let ProcessFileno = process_pb.ProcessFileno;

@RequestMsg.message(process_pb.ProcessExecuteAction, PayloadCase.PROCESS_EXECUTE_ACTION)
export class ExecuteAction extends Message {
    constructor(public args: string[], public workingDir?: string) {
        super();
    }

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
    constructor(public pid: number, public fileno: number, public chunk: Uint8Array = new Uint8Array(0)) {
        super();
    }

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
    async = true;

    constructor(public pid: number, public fileno: number, public chunk: Uint8Array = new Uint8Array(0)) {
        super();
    }

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
    async = true;

    constructor(public pid: number, public exitCode: number) {
        super();
    }

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
