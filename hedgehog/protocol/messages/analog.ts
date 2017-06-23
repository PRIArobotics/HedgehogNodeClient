import "babel-polyfill";

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let io_pb: any = require('../proto/io_pb');

type Subscription = any;

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Request extends Message {
    constructor(public port: number) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setAnalogMessage(msg);
    }
}

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Subscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setAnalogMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.ANALOG_MESSAGE)(
    function parseRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getAnalogMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        if(subscription === undefined)
            return new Request(port);
        else
            return new Subscribe(port, subscription);
    }
);

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Reply extends Message {
    constructor(public port: number, public value: number) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        (<any> containerMsg).setAnalogMessage(msg);
    }
}

@message(io_pb.AnalogMessage, PayloadCase.ANALOG_MESSAGE)
export class Update extends Message {
    async = true;

    constructor(public port: number, public value: number, public subscription: Subscription) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new io_pb.AnalogMessage();
        msg.setPort(this.port);
        msg.setValue(this.value);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setAnalogMessage(msg);
    }
}

ReplyMsg.parser(PayloadCase.ANALOG_MESSAGE)(
    function parseReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getAnalogMessage();
        let port = msg.getPort();
        let value = msg.getValue();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        if(subscription === undefined)
            return new Reply(port, value);
        else
            return new Update(port, value, subscription);
    }
);
