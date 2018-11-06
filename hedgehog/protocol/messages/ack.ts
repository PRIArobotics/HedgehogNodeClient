// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
let ack_pb: any = require('../proto/ack_pb');

// <GSL customizable: module-header>
export let AcknowledgementCode = ack_pb.AcknowledgementCode;
// </GSL customizable: module-header>

@ReplyMsg.message(ack_pb.Acknowledgement, PayloadCase.ACKNOWLEDGEMENT)
export class Acknowledgement extends Message {
    constructor(public code: number = AcknowledgementCode.OK, public message: string = '') {
        super();
    }

    // <default GSL customizable: Acknowledgement-extra-members />

    static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (<any> containerMsg).getAcknowledgement();
        let code = msg.getCode();
        let message = msg.getMessage();
        return new Acknowledgement(code, message);
    }

    serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new ack_pb.Acknowledgement();
        msg.setCode(this.code);
        msg.setMessage(this.message);
        (<any> containerMsg).setAcknowledgement(msg);
    }
}
