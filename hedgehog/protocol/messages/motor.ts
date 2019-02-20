// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { motor_pb } from '../proto';

// <GSL customizable: module-header>
export let MotorState = motor_pb.MotorState;
export enum ConfigKind {
    DC,
    ENCODER,
    STEPPER,
}

export interface MotorConfig {
    kind: ConfigKind;
    encoderAPort?: number;
    encoderBPort?: number;
}

type Subscription = any;
// </GSL customizable: module-header>

@RequestMsg.message(motor_pb.MotorAction, PayloadCase.MOTOR_ACTION)
export class Action extends Message {
    constructor(public port: number, public state: number, public amount: number = 0, public reachedState: number = MotorState.POWER, public relative?: number, public absolute?: number) {
        super();
    }

    // <default GSL customizable: Action-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getMotorAction();
        let port = msg.getPort();
        let state = msg.getState();
        let amount = msg.getAmount();
        let reachedState = msg.getReachedState();
        let relative = msg.hasRelative()? msg.getRelative() : undefined;
        let absolute = msg.hasAbsolute()? msg.getAbsolute() : undefined;
        return new Action(port, state, amount, reachedState, relative, absolute);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorAction();
        msg.setPort(this.port);
        msg.setState(this.state);
        msg.setAmount(this.amount);
        msg.setReachedState(this.reachedState);
        msg.setRelative(this.relative);
        msg.setAbsolute(this.absolute);
        (containerMsg as any).setMotorAction(msg);
    }
}

@RequestMsg.message(motor_pb.MotorConfigAction, PayloadCase.MOTOR_CONFIG_ACTION)
export class ConfigAction extends Message {
    constructor(public port: number, public config: MotorConfig) {
        super();
    }

    // <default GSL customizable: ConfigAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getMotorConfigAction();
        let port = msg.getPort();
        // <GSL customizable: ConfigAction-parse-config>
        let config: MotorConfig;
        switch(msg.getConfigCase()) {
            case motor_pb.MotorConfigAction.ConfigCase.DC:
                config = {
                    kind: ConfigKind.DC,
                };
                break;
            case motor_pb.MotorConfigAction.ConfigCase.ENCODER:
                config = {
                    kind: ConfigKind.ENCODER,
                    encoderAPort: msg.getEncoder().getEncoderAPort(),
                    encoderBPort: msg.getEncoder().getEncoderBPort(),
                };
                break;
            case motor_pb.MotorConfigAction.ConfigCase.STEPPER:
                config = {
                    kind: ConfigKind.STEPPER,
                };
                break;
            default:
                throw new Error("unreachable");
        }
        // </GSL customizable: ConfigAction-parse-config>
        return new ConfigAction(port, config);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorConfigAction();
        msg.setPort(this.port);
        // <GSL customizable: ConfigAction-serialize-config>
        switch(this.config.kind) {
            case ConfigKind.DC:
                msg.setDc(new motor_pb.Dummy());
                break;
            case ConfigKind.ENCODER:
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(this.config.encoderAPort);
                config.setEncoderBPort(this.config.encoderBPort);
                msg.setEncoder(config);
                break;
            case ConfigKind.STEPPER:
                msg.setStepper(new motor_pb.Dummy());
                break;
            default:
                throw new Error("unreachable");
        }
        // </GSL customizable: ConfigAction-serialize-config>
        (containerMsg as any).setMotorConfigAction(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: CommandRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        (containerMsg as any).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandReply extends Message {
    constructor(public port: number, public config: MotorConfig, public state: number, public amount: number) {
        super();
    }

    // <default GSL customizable: CommandReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        // <GSL customizable: CommandReply-serialize-config>
        switch(this.config.kind) {
            case ConfigKind.DC:
                msg.setDc(new motor_pb.Dummy());
                break;
            case ConfigKind.ENCODER:
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(this.config.encoderAPort);
                config.setEncoderBPort(this.config.encoderBPort);
                msg.setEncoder(config);
                break;
            case ConfigKind.STEPPER:
                msg.setStepper(new motor_pb.Dummy());
                break;
            default:
                throw new Error("unreachable");
        }
        // </GSL customizable: CommandReply-serialize-config>
        msg.setState(this.state);
        msg.setAmount(this.amount);
        (containerMsg as any).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorCommandMessage, PayloadCase.MOTOR_COMMAND_MESSAGE)
export class CommandUpdate extends Message {
    public isAsync = true;

    constructor(public port: number, public config: MotorConfig, public state: number, public amount: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: CommandUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorCommandMessage();
        msg.setPort(this.port);
        // <GSL customizable: CommandUpdate-serialize-config>
        switch(this.config.kind) {
            case ConfigKind.DC:
                msg.setDc(new motor_pb.Dummy());
                break;
            case ConfigKind.ENCODER:
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(this.config.encoderAPort);
                config.setEncoderBPort(this.config.encoderBPort);
                msg.setEncoder(config);
                break;
            case ConfigKind.STEPPER:
                msg.setStepper(new motor_pb.Dummy());
                break;
            default:
                throw new Error("unreachable");
        }
        // </GSL customizable: CommandUpdate-serialize-config>
        msg.setState(this.state);
        msg.setAmount(this.amount);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setMotorCommandMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateRequest extends Message {
    constructor(public port: number) {
        super();
    }

    // <default GSL customizable: StateRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        (containerMsg as any).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateReply extends Message {
    constructor(public port: number, public velocity: number, public position: number) {
        super();
    }

    // <default GSL customizable: StateReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setVelocity(this.velocity);
        msg.setPosition(this.position);
        (containerMsg as any).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateSubscribe extends Message {
    constructor(public port: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: StateSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setMotorStateMessage(msg);
    }
}

@message(motor_pb.MotorStateMessage, PayloadCase.MOTOR_STATE_MESSAGE)
export class StateUpdate extends Message {
    public isAsync = true;

    constructor(public port: number, public velocity: number, public position: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: StateUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorStateMessage();
        msg.setPort(this.port);
        msg.setVelocity(this.velocity);
        msg.setPosition(this.position);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setMotorStateMessage(msg);
    }
}

@RequestMsg.message(motor_pb.MotorSetPositionAction, PayloadCase.MOTOR_SET_POSITION_ACTION)
export class SetPositionAction extends Message {
    constructor(public port: number, public position: number) {
        super();
    }

    // <default GSL customizable: SetPositionAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getMotorSetPositionAction();
        let port = msg.getPort();
        let position = msg.getPosition();
        return new SetPositionAction(port, position);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new motor_pb.MotorSetPositionAction();
        msg.setPort(this.port);
        msg.setPosition(this.position);
        (containerMsg as any).setMotorSetPositionAction(msg);
    }
}

RequestMsg.parser(PayloadCase.MOTOR_COMMAND_MESSAGE)(
    function parseMotorCommandMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getMotorCommandMessage();
        let port = msg.getPort();
        let dc = msg.hasDc()? msg.getDc() : undefined;
        let encoder = msg.hasEncoder()? msg.getEncoder() : undefined;
        let stepper = msg.hasStepper()? msg.getStepper() : undefined;
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
        let msg = (containerMsg as any).getMotorCommandMessage();
        let port = msg.getPort();
        let dc = msg.hasDc()? msg.getDc() : undefined;
        let encoder = msg.hasEncoder()? msg.getEncoder() : undefined;
        let stepper = msg.hasStepper()? msg.getStepper() : undefined;
        let state = msg.getState();
        let amount = msg.getAmount();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseMotorCommandMessageReplyFrom-return>
        let config: MotorConfig;
        switch(msg.getConfigCase()) {
            case motor_pb.MotorCommandMessage.ConfigCase.DC:
                config = {
                    kind: ConfigKind.DC,
                };
                break;
            case motor_pb.MotorCommandMessage.ConfigCase.ENCODER:
                config = {
                    kind: ConfigKind.ENCODER,
                    encoderAPort: encoder.getEncoderAPort(),
                    encoderBPort: encoder.getEncoderBPort(),
                };
                break;
            case motor_pb.MotorCommandMessage.ConfigCase.STEPPER:
                config = {
                    kind: ConfigKind.STEPPER,
                };
                break;
            default:
                throw new Error("unreachable");
        }

        if(subscription === undefined)
            return new CommandReply(port, config, state, amount);
        else
            return new CommandUpdate(port, config, state, amount, subscription);
        // </GSL customizable: parseMotorCommandMessageReplyFrom-return>
    }
);

RequestMsg.parser(PayloadCase.MOTOR_STATE_MESSAGE)(
    function parseMotorStateMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getMotorStateMessage();
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
        let msg = (containerMsg as any).getMotorStateMessage();
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
