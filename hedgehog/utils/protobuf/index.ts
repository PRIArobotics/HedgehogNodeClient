type Class<T> = new (...args: any[]) => T;
type DefaultCtorClass<T> = new () => T;

export interface ProtoMessage {
    serializeBinary(): Uint8Array;
}
export interface ProtoContainerMessage extends ProtoMessage {
    getPayloadCase(): number;
}

export interface ProtoMessageCls extends DefaultCtorClass<ProtoMessage> {
    deserializeBinary(data: Uint8Array): ProtoMessage;
}
export interface ProtoContainerMessageCls extends DefaultCtorClass<ProtoContainerMessage> {
    deserializeBinary(data: Uint8Array): ProtoContainerMessage;
}

type MessageCls = Class<Message>;
interface SimpleMessageCls extends MessageCls {
    parseFrom(containerMsg: ProtoContainerMessage): Message;
}

interface MessageMeta {
    payloadCase: number;
    protoClass: ProtoMessageCls;
}

export function message(protoClass: ProtoMessageCls, payloadCase: number) {
    let meta: MessageMeta = {payloadCase, protoClass};

    return <T extends MessageCls>(messageClass: T) => {
        (messageClass as any).meta = meta;
        return messageClass;
    };
}

export class ContainerMessage {
    private registry: { [key: number]: (ProtoMessage) => Message; } = {};

    constructor(private protoClass: ProtoContainerMessageCls) {}

    public message(protoClass: ProtoMessageCls, payloadCase: number) {
        let messageDecorator = message(protoClass, payloadCase);
        let parserDecorator = this.parser(payloadCase);

        return <T extends SimpleMessageCls>(messageClass: T) => {
            messageClass = messageDecorator(messageClass);
            parserDecorator(messageClass.parseFrom);
            return messageClass;
        };
    }

    public parser(payloadCase: number) {
        return (parseFn: (ProtoMessage) => Message) => {
            this.registry[payloadCase] = parseFn;
            return parseFn;
        };
    }

    public parse(data: Uint8Array): Message {
        let msg = this.protoClass.deserializeBinary(data);
        let payloadCase = msg.getPayloadCase();
        let parseFn = this.registry[payloadCase];
        return parseFn(msg);
    }

    public serialize(msg: Message): Uint8Array {
        let containerMsg = new this.protoClass();
        msg.serializeTo(containerMsg);
        return containerMsg.serializeBinary();
    }
}

export abstract class Message {
    public isAsync = false;
    public meta: MessageMeta;

    public abstract serializeTo(containerMsg: ProtoContainerMessage): void;
}
