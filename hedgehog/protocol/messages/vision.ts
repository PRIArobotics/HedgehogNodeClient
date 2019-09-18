// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { vision_pb } from '../proto';

// <GSL customizable: module-header>
export let ChannelOperation = vision_pb.ChannelOperation;

export enum ChannelKind {
    FACES,
    CONTOURS,
}

export interface Channel {
    kind: ChannelKind;
    hsvMin?: number;
    hsvMax?: number;
}

function channelsToList(channels: { [key: string]: Channel }): vision_pb.Channel[] {
    return Object.entries(channels).map(([key, channel]) => {
        let msg = new vision_pb.Channel();
        msg.setKey(key);
        switch(channel.kind) {
            case ChannelKind.FACES:
                msg.setFaces(new vision_pb.FacesChannel());
                break;
            case ChannelKind.CONTOURS:
                let contours = new vision_pb.ContoursChannel();
                contours.setHsvMin(channel.hsvMin);
                contours.setHsvMax(channel.hsvMax);
                msg.setContours(contours);
                break;
            // istanbul ignore next
            default:
                throw new Error("unreachable");
        }
        return msg;
    })
}

function keysToList(keys: string[]): vision_pb.Channel[] {
    return keys.map(key => {
        let msg = new vision_pb.Channel();
        msg.setKey(key);
        return msg;
    })
}

function channelsFromList(channelsList: vision_pb.Channel[]): { [key: string]: Channel } {
    let channels = {};
    for (let channel of channelsList) {
        let key = channel.getKey();
        switch(channel.getChannelCase()) {
            case vision_pb.Channel.ChannelCase.FACES:
                channels[key] = {
                    kind: ChannelKind.FACES,
                };
                break;
            case vision_pb.Channel.ChannelCase.CONTOURS:
                channels[key] = {
                    kind: ChannelKind.CONTOURS,
                    hsvMin: channel.getContours().getHsvMin(),
                    hsvMax: channel.getContours().getHsvMax(),
                };
                break;
            // istanbul ignore next
            default:
                throw new Error("unreachable");
        }
    }
    return channels;
}

function keysFromList(keysList: vision_pb.Channel[]): string[] {
    return keysList.map(channel => channel.getKey());
}
// </GSL customizable: module-header>

@message(vision_pb.VisionCameraAction, PayloadCase.VISION_CAMERA_ACTION)
export class OpenCameraAction extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: OpenCameraAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionCameraAction();
        msg.setOpen(true);
        (containerMsg as any).setVisionCameraAction(msg);
    }
}

@message(vision_pb.VisionCameraAction, PayloadCase.VISION_CAMERA_ACTION)
export class CloseCameraAction extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: CloseCameraAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionCameraAction();
        msg.setOpen(false);
        (containerMsg as any).setVisionCameraAction(msg);
    }
}

@message(vision_pb.VisionChannelMessage, PayloadCase.VISION_CHANNEL_MESSAGE)
export class CreateChannelAction extends Message {
    constructor(public channels: { [key: string]: Channel }) {
        super();
    }

    // <default GSL customizable: CreateChannelAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionChannelMessage();
        // <GSL customizable: CreateChannelAction-serialize-channels>
        msg.setOp(ChannelOperation.CREATE);
        msg.setChannelsList(channelsToList(this.channels));
        // </GSL customizable: CreateChannelAction-serialize-channels>
        (containerMsg as any).setVisionChannelMessage(msg);
    }
}

@message(vision_pb.VisionChannelMessage, PayloadCase.VISION_CHANNEL_MESSAGE)
export class UpdateChannelAction extends Message {
    constructor(public channels: { [key: string]: Channel }) {
        super();
    }

    // <default GSL customizable: UpdateChannelAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionChannelMessage();
        // <GSL customizable: UpdateChannelAction-serialize-channels>
        msg.setOp(ChannelOperation.UPDATE);
        msg.setChannelsList(channelsToList(this.channels));
        // </GSL customizable: UpdateChannelAction-serialize-channels>
        (containerMsg as any).setVisionChannelMessage(msg);
    }
}

@message(vision_pb.VisionChannelMessage, PayloadCase.VISION_CHANNEL_MESSAGE)
export class DeleteChannelAction extends Message {
    constructor(public keys: string[]) {
        super();
    }

    // <default GSL customizable: DeleteChannelAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionChannelMessage();
        // <GSL customizable: DeleteChannelAction-serialize-keys>
        msg.setOp(ChannelOperation.DELETE);
        msg.setChannelsList(keysToList(this.keys));
        // </GSL customizable: DeleteChannelAction-serialize-keys>
        (containerMsg as any).setVisionChannelMessage(msg);
    }
}

@message(vision_pb.VisionChannelMessage, PayloadCase.VISION_CHANNEL_MESSAGE)
export class ChannelRequest extends Message {
    constructor(public keys: string[]) {
        super();
    }

    // <default GSL customizable: ChannelRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionChannelMessage();
        // <GSL customizable: ChannelRequest-serialize-keys>
        msg.setOp(ChannelOperation.READ);
        msg.setChannelsList(keysToList(this.keys));
        // </GSL customizable: ChannelRequest-serialize-keys>
        (containerMsg as any).setVisionChannelMessage(msg);
    }
}

@ReplyMsg.message(vision_pb.VisionChannelMessage, PayloadCase.VISION_CHANNEL_MESSAGE)
export class ChannelReply extends Message {
    constructor(public channels: { [key: string]: Channel }) {
        super();
    }

    // <default GSL customizable: ChannelReply-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionChannelMessage();
        // <GSL customizable: ChannelReply-parse-channels>
        let channels = channelsFromList(msg.getChannelsList());
        // </GSL customizable: ChannelReply-parse-channels>
        return new ChannelReply(channels);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionChannelMessage();
        // <GSL customizable: ChannelReply-serialize-channels>
        msg.setOp(ChannelOperation.READ);
        msg.setChannelsList(channelsToList(this.channels));
        // </GSL customizable: ChannelReply-serialize-channels>
        (containerMsg as any).setVisionChannelMessage(msg);
    }
}

@RequestMsg.message(vision_pb.VisionCaptureFrameAction, PayloadCase.VISION_CAPTURE_FRAME_ACTION)
export class CaptureFrameAction extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: CaptureFrameAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionCaptureFrameAction();
        return new CaptureFrameAction();
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionCaptureFrameAction();
        (containerMsg as any).setVisionCaptureFrameAction(msg);
    }
}

@RequestMsg.message(vision_pb.VisionFrameMessage, PayloadCase.VISION_FRAME_MESSAGE)
export class FrameRequest extends Message {
    constructor(public highlight: string | null) {
        super();
    }

    // <default GSL customizable: FrameRequest-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionFrameMessage();
        let highlight = msg.getHighlight();
        return new FrameRequest(highlight !== '' ? highlight : null);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionFrameMessage();
        msg.setHighlight(this.highlight !== null ? this.highlight : '');
        (containerMsg as any).setVisionFrameMessage(msg);
    }
}

@ReplyMsg.message(vision_pb.VisionFrameMessage, PayloadCase.VISION_FRAME_MESSAGE)
export class FrameReply extends Message {
    constructor(public highlight: string | null, public frame: Uint8Array) {
        super();
    }

    // <default GSL customizable: FrameReply-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionFrameMessage();
        let highlight = msg.getHighlight();
        let frame = Uint8Array.from(msg.getFrame());
        return new FrameReply(highlight !== '' ? highlight : null, frame);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionFrameMessage();
        msg.setHighlight(this.highlight !== null ? this.highlight : '');
        msg.setFrame(this.frame);
        (containerMsg as any).setVisionFrameMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.VISION_CAMERA_ACTION)(
    function parseVisionCameraActionRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionCameraAction();
        let open = msg.getOpen();
        // <GSL customizable: parseVisionCameraActionRequestFrom-return>
        if (open) {
            return new OpenCameraAction();
        } else {
            return new CloseCameraAction();
        }
        // </GSL customizable: parseVisionCameraActionRequestFrom-return>
    }
);

RequestMsg.parser(PayloadCase.VISION_CHANNEL_MESSAGE)(
    function parseVisionChannelMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionChannelMessage();
        let op = msg.getOp();
        let channels = msg.getChannelsList();
        // <GSL customizable: parseVisionChannelMessageRequestFrom-return>
        switch (op) {
            case ChannelOperation.CREATE:
                return new CreateChannelAction(channelsFromList(channels));
            case ChannelOperation.UPDATE:
                return new UpdateChannelAction(channelsFromList(channels));
            case ChannelOperation.READ:
                return new ChannelRequest(keysFromList(channels));
            case ChannelOperation.DELETE:
                return new DeleteChannelAction(keysFromList(channels));
            // istanbul ignore next
            default:
                throw new Error("unreachable");
        }
        // </GSL customizable: parseVisionChannelMessageRequestFrom-return>
    }
);
