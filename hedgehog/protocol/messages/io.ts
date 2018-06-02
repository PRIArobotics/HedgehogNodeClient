import "babel-polyfill";

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let io_pb: any = require('../proto/io_pb');

// <GSL customizable: module-header>
export let IOFlags = io_pb.IOFlags;

type Subscription = any;
// </GSL customizable: module-header>

@RequestMsg.message(io_pb.IOAction, PayloadCase.IO_ACTION)
export class Action extends Message {
    constructor(public port: number, public flags: number) {
        super();
    }

    // <default GSL customizable: Action-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getIoAction();
        let port = msg.getPort();
        let flags = msg.getFlags();
        return new Action(port, flags);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.IOAction();
        msg.setPort(this.port);
        msg.setFlags(this.flags);
        (<any> containerMsg).setIoAction(msg);
    }
}

@message(io_pb.IOCommandMessage, PayloadCase.IO_COMMAND_MESSAGE)
export class CommandRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: CommandRequest-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.IOCommandMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setIoCommandMessage(msg);
    }
}

@message(io_pb.IOCommandMessage, PayloadCase.IO_COMMAND_MESSAGE)
export class CommandReply extends Message {
    constructor(public port: number, public flags: number) {
        super();
    }

    // <default GSL customizable: CommandReply-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.IOCommandMessage();
        msg.setPort(this.port);
        msg.setFlags(this.flags);
        (<any> containerMsg).setIoCommandMessage(msg);
    }
}

@message(io_pb.IOCommandMessage, PayloadCase.IO_COMMAND_MESSAGE)
export class CommandSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandSubscribe-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.IOCommandMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setIoCommandMessage(msg);
    }
}

@message(io_pb.IOCommandMessage, PayloadCase.IO_COMMAND_MESSAGE)
export class CommandUpdate extends Message {
    async = true;

    constructor(public port: number, public flags: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandUpdate-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.IOCommandMessage();
        msg.setPort(this.port);
        msg.setFlags(this.flags);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setIoCommandMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.IO_COMMAND_MESSAGE)(
    function parseIOCommandMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getIoCommandMessage();
        let port = msg.getPort();
        let flags = msg.getFlags();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseIOCommandMessageRequestFrom-return>
        if(subscription === undefined)
            return new CommandRequest(port);
        else
            return new CommandSubscribe(port, subscription);
        // </GSL customizable: parseIOCommandMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.IO_COMMAND_MESSAGE)(
    function parseIOCommandMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getIoCommandMessage();
        let port = msg.getPort();
        let flags = msg.getFlags();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseIOCommandMessageReplyFrom-return>
        if(subscription === undefined)
            return new CommandReply(port, flags);
        else
            return new CommandUpdate(port, flags, subscription);
        // </GSL customizable: parseIOCommandMessageReplyFrom-return>
    }
);
