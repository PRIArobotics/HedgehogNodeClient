// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { process_pb } from '../proto';

// <GSL customizable: module-header>
export let ProcessFileno = process_pb.ProcessFileno;
// </GSL customizable: module-header>

@RequestMsg.message(process_pb.ProcessExecuteAction, PayloadCase.PROCESS_EXECUTE_ACTION)
export class ExecuteAction extends Message {
    constructor(public args: string[], public workingDir?: string) {
        super();
    }

    // <default GSL customizable: ExecuteAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessExecuteAction();
        let args = msg.getArgsList();
        let workingDir = msg.getWorkingDir();
        return new ExecuteAction(args, workingDir);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExecuteAction();
        msg.setArgsList(this.args);
        msg.setWorkingDir(this.workingDir);
        (containerMsg as any).setProcessExecuteAction(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessExecuteReply, PayloadCase.PROCESS_EXECUTE_REPLY)
export class ExecuteReply extends Message {
    constructor(public pid: number) {
        super();
    }

    // <default GSL customizable: ExecuteReply-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessExecuteReply();
        let pid = msg.getPid();
        return new ExecuteReply(pid);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExecuteReply();
        msg.setPid(this.pid);
        (containerMsg as any).setProcessExecuteReply(msg);
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

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessStreamMessage();
        let pid = msg.getPid();
        let fileno = msg.getFileno();
        let chunk = Uint8Array.from(msg.getChunk());
        return new StreamAction(pid, fileno, chunk);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessStreamMessage();
        msg.setPid(this.pid);
        msg.setFileno(this.fileno);
        msg.setChunk(this.chunk);
        (containerMsg as any).setProcessStreamMessage(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessStreamMessage, PayloadCase.PROCESS_STREAM_MESSAGE)
export class StreamUpdate extends Message {
    public isAsync = true;

    constructor(public pid: number, public fileno: number, public chunk?: Uint8Array) {
        super();
        if(chunk && chunk.length === 0)
            this.chunk = undefined;
    }

    // <default GSL customizable: StreamUpdate-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessStreamMessage();
        let pid = msg.getPid();
        let fileno = msg.getFileno();
        let chunk = Uint8Array.from(msg.getChunk());
        return new StreamUpdate(pid, fileno, chunk);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessStreamMessage();
        msg.setPid(this.pid);
        msg.setFileno(this.fileno);
        msg.setChunk(this.chunk);
        (containerMsg as any).setProcessStreamMessage(msg);
    }
}

@RequestMsg.message(process_pb.ProcessSignalAction, PayloadCase.PROCESS_SIGNAL_ACTION)
export class SignalAction extends Message {
    constructor(public pid: number, public signal: number) {
        super();
    }

    // <default GSL customizable: SignalAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessSignalAction();
        let pid = msg.getPid();
        let signal = msg.getSignal();
        return new SignalAction(pid, signal);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessSignalAction();
        msg.setPid(this.pid);
        msg.setSignal(this.signal);
        (containerMsg as any).setProcessSignalAction(msg);
    }
}

@ReplyMsg.message(process_pb.ProcessExitUpdate, PayloadCase.PROCESS_EXIT_UPDATE)
export class ExitUpdate extends Message {
    public isAsync = true;

    constructor(public pid: number, public exitCode: number) {
        super();
    }

    // <default GSL customizable: ExitUpdate-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getProcessExitUpdate();
        let pid = msg.getPid();
        let exitCode = msg.getExitCode();
        return new ExitUpdate(pid, exitCode);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new process_pb.ProcessExitUpdate();
        msg.setPid(this.pid);
        msg.setExitCode(this.exitCode);
        (containerMsg as any).setProcessExitUpdate(msg);
    }
}
