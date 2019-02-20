// tslint:disable

import { RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage } from './index';
import { imu_pb } from '../proto';

// <GSL customizable: module-header>
type Subscription = any;
// </GSL customizable: module-header>

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class RateRequest extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: RateRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class RateReply extends Message {
    constructor(public x: number, public y: number, public z: number) {
        super();
    }

    // <default GSL customizable: RateReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class RateSubscribe extends Message {
    constructor(public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: RateSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class RateUpdate extends Message {
    public isAsync = true;

    constructor(public x: number, public y: number, public z: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: RateUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class AccelerationRequest extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: AccelerationRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class AccelerationReply extends Message {
    constructor(public x: number, public y: number, public z: number) {
        super();
    }

    // <default GSL customizable: AccelerationReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class AccelerationSubscribe extends Message {
    constructor(public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: AccelerationSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class AccelerationUpdate extends Message {
    public isAsync = true;

    constructor(public x: number, public y: number, public z: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: AccelerationUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class PoseRequest extends Message {
    constructor() {
        super();
    }

    // <default GSL customizable: PoseRequest-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class PoseReply extends Message {
    constructor(public x: number, public y: number, public z: number) {
        super();
    }

    // <default GSL customizable: PoseReply-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class PoseSubscribe extends Message {
    constructor(public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: PoseSubscribe-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

@message(imu_pb.ImuMessage, PayloadCase.IMU_MESSAGE)
export class PoseUpdate extends Message {
    public isAsync = true;

    constructor(public x: number, public y: number, public z: number, public subscription: Subscription) {
        super();
    }

    // <default GSL customizable: PoseUpdate-extra-members />

    public serializeTo(containerMsg: ProtoContainerMessage): void {
        let msg = new imu_pb.ImuMessage();
        msg.setX(this.x);
        msg.setY(this.y);
        msg.setZ(this.z);
        msg.setSubscription(this.subscription);
        (containerMsg as any).setImuMessage(msg);
    }
}

RequestMsg.parser(PayloadCase.IMU_MESSAGE)(
    function parseImuMessageRequestFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getImuMessage();
        let kind = msg.getKind();
        let x = msg.getX();
        let y = msg.getY();
        let z = msg.getZ();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <default GSL customizable: parseImuMessageRequestFrom-return>
        // TODO return correct message instance
        //return new RateRequest();
        //return new RateSubscribe(subscription);
        //return new AccelerationRequest();
        //return new AccelerationSubscribe(subscription);
        //return new PoseRequest();
        //return new PoseSubscribe(subscription);
        return null;
        // </GSL customizable: parseImuMessageRequestFrom-return>
    }
);

ReplyMsg.parser(PayloadCase.IMU_MESSAGE)(
    function parseImuMessageReplyFrom(containerMsg: ProtoContainerMessage): Message {
        let msg = (containerMsg as any).getImuMessage();
        let kind = msg.getKind();
        let x = msg.getX();
        let y = msg.getY();
        let z = msg.getZ();
        let subscription = msg.hasSubscription()? msg.getSubscription() : undefined;
        // <default GSL customizable: parseImuMessageReplyFrom-return>
        // TODO return correct message instance
        //return new RateReply(x, y, z);
        //return new RateUpdate(x, y, z, subscription);
        //return new AccelerationReply(x, y, z);
        //return new AccelerationUpdate(x, y, z, subscription);
        //return new PoseReply(x, y, z);
        //return new PoseUpdate(x, y, z, subscription);
        return null;
        // </GSL customizable: parseImuMessageReplyFrom-return>
    }
);
