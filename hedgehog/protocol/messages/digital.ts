import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let io_pb: any = require('../proto/io_pb');

// <GSL customizable: module-header>
type Subscription = any;
// </GSL customizable: module-header>

@message(io_pb.DigitalMessage, PayloadCase.DIGITAL_MESSAGE)
export class Request extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: Request-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.DigitalMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setDigitalMessage(msg);
    }
}

@message(io_pb.DigitalMessage, PayloadCase.DIGITAL_MESSAGE)
export class Reply extends Message {
    constructor(public port: number, public value: boolean) {
        super();
    }

    // <default GSL customizable: Reply-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.DigitalMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        (<any> containerMsg).setDigitalMessage(msg);
    }
}

@message(io_pb.DigitalMessage, PayloadCase.DIGITAL_MESSAGE)
export class Subscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Subscribe-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.DigitalMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setDigitalMessage(msg);
    }
}

@message(io_pb.DigitalMessage, PayloadCase.DIGITAL_MESSAGE)
export class Update extends Message {
    isAsync = true;

    constructor(public port: number, public value: boolean, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Update-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.DigitalMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setDigitalMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.DIGITAL_MESSAGE)(
    function parseDigitalMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getDigitalMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseDigitalMessageRequestFrom-return>
        if(subscription === undefined)
            return new Request(port);
        else
            return new Subscribe(port, subscription);
        // </GSL customizable: parseDigitalMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.DIGITAL_MESSAGE)(
    function parseDigitalMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getDigitalMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseDigitalMessageReplyFrom-return>
        if(subscription === undefined)
            return new Reply(port, value);
        else
            return new Update(port, value, subscription);
        // </GSL customizable: parseDigitalMessageReplyFrom-return>
    }
);
