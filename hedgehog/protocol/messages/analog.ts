// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import io_pb = require('../proto/io_pb');

// <GSL customizable: module-header>
type Subscription = any;
// </GSL customizable: module-header>

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Request extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: Request-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        (containerMsg as any).setAnalogMessage(msg);
    }
}

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Reply extends Message {
    constructor(public port: number, public value: number) {
        super();
    }

    // <default GSL customizable: Reply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        (containerMsg as any).setAnalogMessage(msg);
    }
}

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Subscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Subscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setAnalogMessage(msg);
    }
}

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Update extends Message {
    public isAsync = true;

    constructor(public port: number, public value: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Update-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setAnalogMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.ANALOG_MESSAGE)(
    function parseAnalogMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getAnalogMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseAnalogMessageRequestFrom-return>
        if(subscription === undefined)
            return new Request(port);
        else
            return new Subscribe(port, subscription);
        // </GSL customizable: parseAnalogMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.ANALOG_MESSAGE)(
    function parseAnalogMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getAnalogMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseAnalogMessageReplyFrom-return>
        if(subscription === undefined)
            return new Reply(port, value);
        else
            return new Update(port, value, subscription);
        // </GSL customizable: parseAnalogMessageReplyFrom-return>
    }
);
