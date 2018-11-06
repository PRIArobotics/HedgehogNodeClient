// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import servo_pb = require('../proto/servo_pb');

// <GSL customizable: module-header>
type Subscription = any;
// </GSL customizable: module-header>

@RequestMsg.message(servo_pb.ServoAction, PayloadCase.SERVO_ACTION)
export class Action extends Message {
    constructor(public port: number, public active: boolean, public position?: number) {
        super();
        if(!active)
            this.position = undefined;
    }

    // <default GSL customizable: Action-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getServoAction();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        return new Action(port, active, position);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoAction();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        (containerMsg as any).setServoAction(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: CommandRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        (containerMsg as any).setServoCommandMessage(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandReply extends Message {
    constructor(public port: number, public active: boolean, public position: number) {
        super();
        if(!active)
            this.position = undefined;
    }

    // <default GSL customizable: CommandReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        (containerMsg as any).setServoCommandMessage(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setServoCommandMessage(msg);
    }
}

@message(servo_pb.ServoCommandMessage, PayloadCase.SERVO_COMMAND_MESSAGE)
export class CommandUpdate extends Message {
    public isAsync = true;

    constructor(public port: number, public active: boolean, public position: number, public subscription: Subscription) {
        super();
        if(!active)
            this.position = undefined;
    }

    // <default GSL customizable: CommandUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new servo_pb.ServoCommandMessage();
        msg.setPort(this.port);
        msg.setActive(this.active);
        msg.setPosition(this.position);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setServoCommandMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.SERVO_COMMAND_MESSAGE)(
    function parseServoCommandMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getServoCommandMessage();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseServoCommandMessageRequestFrom-return>
        if(subscription === undefined)
            return new CommandRequest(port);
        else
            return new CommandSubscribe(port, subscription);
        // </GSL customizable: parseServoCommandMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.SERVO_COMMAND_MESSAGE)(
    function parseServoCommandMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getServoCommandMessage();
        let port = msg.getPort();
        let active = msg.getActive();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseServoCommandMessageReplyFrom-return>
        if(subscription === undefined)
            return new CommandReply(port, active, position);
        else
            return new CommandUpdate(port, active, position, subscription);
        // </GSL customizable: parseServoCommandMessageReplyFrom-return>
    }
);
