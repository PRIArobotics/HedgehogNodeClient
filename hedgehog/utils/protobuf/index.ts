type Class<T> = new (...args: any[]) => T;
type DefaultCtorClass<T> = new () => T;

export interface ProtoMessage {
    serializeBinary(): Uint8Array;
}
export type ProtoContainerMessage = ProtoMessage & {
    getPayloadCase(): number;
}

export type ProtoMessageCls = DefaultCtorClass<ProtoMessage> & {
    deserializeBinary(data: Uint8Array): ProtoMessage;
};
export type ProtoContainerMessageCls = DefaultCtorClass<ProtoContainerMessage> & {
    deserializeBinary(data: Uint8Array): ProtoContainerMessage;
};

type MessageCls = Class<Message>;
type SimpleMessageCls = MessageCls & {
    parseFrom(containerMsg: ProtoContainerMessage): Message;
};

interface MessageMeta {
    payloadCase: number;
    protoClass: ProtoMessageCls;
}

export function message(protoClass: ProtoMessageCls, payloadCase: number) {
    let meta: MessageMeta = {
        payloadCase: payloadCase,
        protoClass: protoClass,
    };

    return function<T extends MessageCls>(messageClass: T): T {
        (<any> messageClass).meta = meta;
        return messageClass;
    }
}

export class ContainerMessage {
    private registry: { [key: number]: (ProtoMessage) => Message; } = {};

    constructor(private protoClass: ProtoContainerMessageCls) {}

    message(protoClass: ProtoMessageCls, payloadCase: number) {
        let messageDecorator = message(protoClass, payloadCase);
        let parserDecorator = this.parser(payloadCase);

        return function<T extends SimpleMessageCls>(messageClass: T): T {
            messageClass = messageDecorator(messageClass);
            parserDecorator(messageClass.parseFrom);
            return messageClass;
        }
    }

    parser(payloadCase: number) {
        let _this = this;
        return function(parseFn: (ProtoMessage) => Message) {
            _this.registry[payloadCase] = parseFn;
            return parseFn;
        }
    }

    parse(data: Uint8Array): Message {
        let msg = this.protoClass.deserializeBinary(data);
        let payloadCase = msg.getPayloadCase();
        let parseFn = this.registry[payloadCase];
        return parseFn(msg);
    }

    serialize(msg: Message): Uint8Array {
        let containerMsg = new this.protoClass();
        msg.serializeTo(containerMsg);
        return containerMsg.serializeBinary();
    }
}

export abstract class Message {
    isAsync = false;
    meta: MessageMeta;

    abstract serializeTo(containerMsg: ProtoContainerMessage): void;
}
