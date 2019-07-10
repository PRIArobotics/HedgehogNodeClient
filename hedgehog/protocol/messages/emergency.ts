// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { emergency_pb } from '../proto';

// <GSL customizable: module-header>
type Subscription = any;
// </GSL customizable: module-header>

@RequestMsg.message(emergency_pb.EmergencyAction, PayloadCase.EMERGENCY_ACTION)
export class Action extends Message {
    constructor(public activate: boolean) {
        super();
    }

    // <default GSL customizable: Action-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getEmergencyAction();
        let activate = msg.getActivate();
        return new Action(activate);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new emergency_pb.EmergencyAction();
        msg.setActivate(this.activate);
        (containerMsg as any).setEmergencyAction(msg);
    }
}

@message(emergency_pb.EmergencyMessage, PayloadCase.EMERGENCY_MESSAGE)
export class Request extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: Request-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new emergency_pb.EmergencyMessage();
        (containerMsg as any).setEmergencyMessage(msg);
    }
}

@message(emergency_pb.EmergencyMessage, PayloadCase.EMERGENCY_MESSAGE)
export class Reply extends Message {
    constructor(public active: boolean) {
        super();
    }

    // <default GSL customizable: Reply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new emergency_pb.EmergencyMessage();
        msg.setActive(this.active);
        (containerMsg as any).setEmergencyMessage(msg);
    }
}

@message(emergency_pb.EmergencyMessage, PayloadCase.EMERGENCY_MESSAGE)
export class Subscribe extends Message {
    constructor(public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Subscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new emergency_pb.EmergencyMessage();
        msg.setSubscription(this.subscription);
        (containerMsg as any).setEmergencyMessage(msg);
    }
}

@message(emergency_pb.EmergencyMessage, PayloadCase.EMERGENCY_MESSAGE)
export class Update extends Message {
    public isAsync = true;

    constructor(public active: boolean, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: Update-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new emergency_pb.EmergencyMessage();
        msg.setActive(this.active);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setEmergencyMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.EMERGENCY_MESSAGE)(
    function parseEmergencyMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getEmergencyMessage();
        let active = msg.getActive();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <GSL customizable: parseEmergencyMessageRequestFrom-return>
        if(subscription === undefined)
            return new Request();
        else
            return new Subscribe(subscription);
        // </GSL customizable: parseEmergencyMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.EMERGENCY_MESSAGE)(
    function parseEmergencyMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getEmergencyMessage();
        let active = msg.getActive();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <default GSL customizable: parseEmergencyMessageReplyFrom-return>
        // TODO return correct message instance
        if(subscription === undefined)
            return new Reply(active);
        else
            return new Update(active, subscription);
        // </GSL customizable: parseEmergencyMessageReplyFrom-return>
    }
);
