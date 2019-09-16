// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { vision_pb } from '../proto';

// <GSL customizable: module-header>
export enum ChannelKind {
    FACES,
    CONTOURS,
}

export interface Channel {
    kind: ChannelKind;
    hsvMin?: number;
    hsvMax?: number;
}
// </GSL customizable: module-header>

@message(vision_pb.VisionCameraAction, PayloadCase.VISION_CAMERA_ACTION)
export class OpenCameraAction extends Message {
    constructor(public channels: Channel[]) {
        super();
    }

    // <default GSL customizable: OpenCameraAction-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionCameraAction();
        msg.setOpen(true);
        msg.setChannelsList(this.channels.map(channel => {
            let msg = new vision_pb.Channel();
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
        }));
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

@RequestMsg.message(vision_pb.VisionRetrieveFrameAction, PayloadCase.VISION_RETRIEVE_FRAME_ACTION)
export class RetrieveFrameAction extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: RetrieveFrameAction-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionRetrieveFrameAction();
        return new RetrieveFrameAction();
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionRetrieveFrameAction();
        (containerMsg as any).setVisionRetrieveFrameAction(msg);
    }
}

@RequestMsg.message(vision_pb.VisionFrameMessage, PayloadCase.VISION_FRAME_MESSAGE)
export class FrameRequest extends Message {
    constructor(public highlight: number | null) {
        super();
    }

    // <default GSL customizable: FrameRequest-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionFrameMessage();
        let highlight = msg.getHighlight();
        return new FrameRequest(highlight !== -1 ? highlight : null);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionFrameMessage();
        msg.setHighlight(this.highlight !== null ? this.highlight : -1);
        (containerMsg as any).setVisionFrameMessage(msg);
    }
}

@ReplyMsg.message(vision_pb.VisionFrameMessage, PayloadCase.VISION_FRAME_MESSAGE)
export class FrameReply extends Message {
    constructor(public highlight: number | null, public frame: Uint8Array) {
        super();
    }

    // <default GSL customizable: FrameReply-extra-members />

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionFrameMessage();
        let highlight = msg.getHighlight();
        let frame = Uint8Array.from(msg.getFrame());
        return new FrameReply(highlight !== -1 ? highlight : null, frame);
    }

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new vision_pb.VisionFrameMessage();
        msg.setHighlight(this.highlight !== null ? this.highlight : -1);
        msg.setFrame(this.frame);
        (containerMsg as any).setVisionFrameMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.VISION_CAMERA_ACTION)(
    function parseVisionCameraActionRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getVisionCameraAction();
        let open = msg.getOpen();
        let channels = msg.getChannelsList();
        // <GSL customizable: parseVisionCameraActionRequestFrom-return>
        if (open) {
            channels = channels.map(msg => {
                switch(msg.getChannelCase()) {
                    case vision_pb.Channel.ChannelCase.FACES:
                        return {
                            kind: ChannelKind.FACES,
                        };
                    case vision_pb.Channel.ChannelCase.CONTOURS:
                        return {
                            kind: ChannelKind.CONTOURS,
                            hsvMin: msg.getContours().getHsvMin(),
                            hsvMax: msg.getContours().getHsvMax(),
                        };
                    // istanbul ignore next
                    default:
                        throw new Error("unreachable");
                }
            });
            return new OpenCameraAction(channels);
        } else {
            return new CloseCameraAction();
        }
        // </GSL customizable: parseVisionCameraActionRequestFrom-return>
    }
);
