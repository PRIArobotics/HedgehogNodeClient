// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { version_pb } from '../proto';

// <default GSL customizable: module-header />

@RequestMsg.message(version_pb.VersionMessage, PayloadCase.VERSION_MESSAGE)
export class Request extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: Request-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVersionMessage();
        return new Request();
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new version_pb.VersionMessage();
        (containerMsg as any).setVersionMessage(msg);
    }
}

@ReplyMsg.message(version_pb.VersionMessage, PayloadCase.VERSION_MESSAGE)
export class Reply extends Message {
    constructor(public ucId: Uint8Array, public hardwareVersion: string, public firmwareVersion: string, public serverVersion: string) {
        super();
    }

    // <default GSL customizable: Reply-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVersionMessage();
        let ucId = msg.getUcId();
        let hardwareVersion = msg.getHardwareVersion();
        let firmwareVersion = msg.getFirmwareVersion();
        let serverVersion = msg.getServerVersion();
        return new Reply(ucId, hardwareVersion, firmwareVersion, serverVersion);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new version_pb.VersionMessage();
        msg.setUcId(this.ucId);
        msg.setHardwareVersion(this.hardwareVersion);
        msg.setFirmwareVersion(this.firmwareVersion);
        msg.setServerVersion(this.serverVersion);
        (containerMsg as any).setVersionMessage(msg);
    }
}
