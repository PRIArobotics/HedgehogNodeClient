import "babel-polyfill";

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let servo_pb: any = require('../proto/servo_pb');

type Subscription = any;

@RequestMsg.message(servo_pb.ServoAction, PayloadCase.SERVO_ACTION)
export class Action extends Message {
    constructor(public port: number, public active: boolean, public position?: number) {
        super();
        if(!active)
            this.position = undefined;
    }

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getServoAction();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        return new Action(port, active, position);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoAction();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        (<any> containerMsg).setServoAction(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandRequest extends Message {
    constructor(public port: number) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setServoCommandMessage(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setServoCommandMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.SERVO_COMMAND_MESSAGE)(
    function parseCommandRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getServoCommandMessage();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        if(subscription === undefined)
            return new CommandRequest(port);
        else
            return new CommandSubscribe(port, subscription);
    }
);

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandReply extends Message {
    constructor(public port: number, public active: boolean, public position: number) {
        super();
        if(!active)
            this.position = undefined;
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        (<any> containerMsg).setServoCommandMessage(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandUpdate extends Message {
    async = true;

    constructor(public port: number, public active: boolean, public position: number, public subscription: Subscription) {
        super();
        if(!active)
            this.position = undefined;
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setServoCommandMessage(msg);
    }
}

ReplyMsg.parser(PayloadCase.SERVO_COMMAND_MESSAGE)(
    function parseCommandReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getServoCommandMessage();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        if(subscription === undefined)
            return new CommandReply(port, active, position);
        else
            return new CommandUpdate(port, active, position, subscription);
    }
);
