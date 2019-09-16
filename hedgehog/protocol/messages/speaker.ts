// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { speaker_pb } from '../proto';

// <default GSL customizable: module-header />

@RequestMsg.message(speaker_pb.SpeakerAction, PayloadCase.SPEAKER_ACTION)
export class Action extends Message {
    constructor(public frequency: number | null) {
        super();
    }

    // <default GSL customizable: Action-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getSpeakerAction();
        let frequency = msg.getFrequency();
        return new Action(frequency !== 0 ? frequency : null);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new speaker_pb.SpeakerAction();
        msg.setFrequency(this.frequency !== null ? this.frequency : 0);
        (containerMsg as any).setSpeakerAction(msg);
    }
}
