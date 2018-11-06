// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let motor_pb: any = require('../proto/motor_pb');

// <GSL customizable: module-header>
export let MotorState = motor_pb.MotorState;

type Subscription = any;
// </GSL customizable: module-header>

@RequestMsg.message(motor_pb.MotorAction, PayloadCase.MOTOR_ACTION)
export class Action extends Message {
    constructor(public port: number, public state: number, public amount: number = 0, public reachedState: number = MotorState.POWER, public relative?: number, public absolute?: number) {
        super();
    }

    // <default GSL customizable: Action-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorAction();
        let port = msg.getPort();
        let state = msg.getState();
        let amount = msg.getAmount();
        let reachedState = msg.getReachedState();
        let relative = msg.hasRelative()? msg.getRelative() : undefined;
        let absolute = msg.hasAbsolute()? msg.getAbsolute() : undefined;
        return new Action(port, state, amount, reachedState, relative, absolute);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorAction();
        msg.setPort(this.port);
        msg.setState(this.state);
        msg.setAmount(this.amount);
        msg.setReachedState(this.reachedState);
        msg.setRelative(this.relative);
        msg.setAbsolute(this.absolute);
        (<any> containerMsg).setMotorAction(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: CommandRequest-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandReply extends Message {
    constructor(public port: number, public state: number, public amount: number) {
        super();
    }

    // <default GSL customizable: CommandReply-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        msg.setState(this.state);
        msg.setAmount(this.amount);
        (<any> containerMsg).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandSubscribe-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandUpdate extends Message {
    isAsync = true;

    constructor(public port: number, public state: number, public amount: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandUpdate-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        msg.setState(this.state);
        msg.setAmount(this.amount);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: StateRequest-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        (<any> containerMsg).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateReply extends Message {
    constructor(public port: number, public velocity: number, public position: number) {
        super();
    }

    // <default GSL customizable: StateReply-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setVelocity(this.velocity);
        msg.setPosition(this.position);
        (<any> containerMsg).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: StateSubscribe-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateUpdate extends Message {
    isAsync = true;

    constructor(public port: number, public velocity: number, public position: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: StateUpdate-extra-members />

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setVelocity(this.velocity);
        msg.setPosition(this.position);
        msg.setSubscription(this.subscription);
        (<any> containerMsg).setMotorStateMessage(msg);
    }
}

@RequestMsg.message(motor_pb.MotorSetPositionAction, PayloadCase.MOTOR_SET_POSITION_ACTION)
export class SetPositionAction extends Message {
    constructor(public port: number, public position: number) {
        super();
    }

    // <default GSL customizable: SetPositionAction-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorSetPositionAction();
        let port = msg.getPort();
        let position = msg.getPosition();
        return new SetPositionAction(port, position);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorSetPositionAction();
        msg.setPort(this.port);
        msg.setPosition(this.position);
        (<any> containerMsg).setMotorSetPositionAction(msg);
    }
}

RequestMsg.parser(PayloadCase.MOTOR_COMMAND_MESSAGE)(
    function parseMotorCommandMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorCommandMessage();
        let port = msg.getPort();
        let state = msg.getState();
        let amount = msg.getAmount();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseMotorCommandMessageRequestFrom-return>
        if(subscription === undefined)
            return new CommandRequest(port);
        else
            return new CommandSubscribe(port, subscription);
        // </GSL customizable: parseMotorCommandMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.MOTOR_COMMAND_MESSAGE)(
    function parseMotorCommandMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorCommandMessage();
        let port = msg.getPort();
        let state = msg.getState();
        let amount = msg.getAmount();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseMotorCommandMessageReplyFrom-return>
        if(subscription === undefined)
            return new CommandReply(port, state, amount);
        else
            return new CommandUpdate(port, state, amount, subscription);
        // </GSL customizable: parseMotorCommandMessageReplyFrom-return>
    }
);

RequestMsg.parser(PayloadCase.MOTOR_STATE_MESSAGE)(
    function parseMotorStateMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorStateMessage();
        let port = msg.getPort();
        let velocity = msg.getVelocity();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseMotorStateMessageRequestFrom-return>
        if(subscription === undefined)
            return new StateRequest(port);
        else
            return new StateSubscribe(port, subscription);
        // </GSL customizable: parseMotorStateMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.MOTOR_STATE_MESSAGE)(
    function parseMotorStateMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getMotorStateMessage();
        let port = msg.getPort();
        let velocity = msg.getVelocity();
        let position = msg.getPosition();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseMotorStateMessageReplyFrom-return>
        if(subscription === undefined)
            return new StateReply(port, velocity, position);
        else
            return new StateUpdate(port, velocity, position, subscription);
        // </GSL customizable: parseMotorStateMessageReplyFrom-return>
    }
);
