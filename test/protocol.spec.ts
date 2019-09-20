import "@babel/polyfill";


import * as assert from 'assert';

import {
    hedgehog_pb,
    ack_pb, version_pb, emergency_pb, imu_pb, io_pb, motor_pb, servo_pb, process_pb, speaker_pb, vision_pb,
    subscription_pb,
} from '../hedgehog/protocol/proto';
import {
    protocol, Message,
    ack, version, emergency, imu, io, analog, digital, motor, servo, process, speaker, vision,
} from "../hedgehog";
import { ProtoContainerMessage } from "../hedgehog/utils/protobuf";

describe('Protocol', () => {
    function testMessage(msg: Message, wire: ProtoContainerMessage, container: protocol.ContainerMessage) {
        let onWire = container.serialize(msg);
        assert.deepStrictEqual(onWire, wire.serializeBinary());
        let received = container.parse(onWire);
        assert.deepStrictEqual(received, msg);
    }

    function makeWire(fn: (wire) => void): ProtoContainerMessage {
        let wire = new hedgehog_pb.HedgehogMessage();
        fn(wire);
        return wire;
    }

    describe('Acknowledgement', () =>  {
        it("should translate `ack.Acknowledgement` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new ack_pb.Acknowledgement();
                proto.setCode(ack.AcknowledgementCode.OK);
                proto.setMessage('');
                _wire.setAcknowledgement(proto);
            });

            let msg = new ack.Acknowledgement();
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('VersionMessage', () =>  {
        it("should translate `version.Request` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new version_pb.VersionMessage();
                _wire.setVersionMessage(proto);
            });

            let msg = new version.Request();
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `version.Reply` successfully", () => {
            let ucId = Uint8Array.from('\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' as any);

            let wire = makeWire(_wire => {
                let proto = new version_pb.VersionMessage();
                proto.setUcId(ucId);
                proto.setHardwareVersion("3");
                proto.setFirmwareVersion("0");
                proto.setServerVersion("0.9.0a2");
                _wire.setVersionMessage(proto);
            });

            let msg = new version.Reply(ucId, "3", "0", "0.9.0a2");
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('EmergencyAction', () =>  {
        it("should translate `emergency.Action` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new emergency_pb.EmergencyAction();
                proto.setActivate(true);
                _wire.setEmergencyAction(proto);
            });

            let msg = new emergency.Action(true);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('EmergencyMessage', () =>  {
        it("should translate `emergency.Request` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new emergency_pb.EmergencyMessage();
                _wire.setEmergencyMessage(proto);
            });

            let msg = new emergency.Request();
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `emergency.Subscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new emergency_pb.EmergencyMessage();
                proto.setSubscription(sub);
                _wire.setEmergencyMessage(proto);
            });

            let msg = new emergency.Subscribe(sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `emergency.Reply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new emergency_pb.EmergencyMessage();
                proto.setActive(true);
                _wire.setEmergencyMessage(proto);
            });

            let msg = new emergency.Reply(true);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `emergency.Update` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new emergency_pb.EmergencyMessage();
                proto.setActive(true);
                proto.setSubscription(sub);
                _wire.setEmergencyMessage(proto);
            });

            let msg = new emergency.Update(true, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('IMUMessage', () =>  {
        it("should translate `imu.RateRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.RATE);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.RateRequest();
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.RateSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.RATE);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.RateSubscribe(sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.RateReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.RATE);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.RateReply(0, 0, -100);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `imu.RateUpdate` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.RATE);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.RateUpdate(0, 0, -100, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });


        it("should translate `imu.AccelerationRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.ACCELERATION);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.AccelerationRequest();
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.AccelerationSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.ACCELERATION);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.AccelerationSubscribe(sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.AccelerationReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.ACCELERATION);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.AccelerationReply(0, 0, -100);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `imu.AccelerationUpdate` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.ACCELERATION);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.AccelerationUpdate(0, 0, -100, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });


        it("should translate `imu.PoseRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.POSE);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.PoseRequest();
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.PoseSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.POSE);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.PoseSubscribe(sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `imu.PoseReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.POSE);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.PoseReply(0, 0, -100);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `imu.PoseUpdate` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new imu_pb.ImuMessage();
                proto.setKind(imu.ImuKind.POSE);
                proto.setX(0);
                proto.setY(0);
                proto.setZ(-100);
                proto.setSubscription(sub);
                _wire.setImuMessage(proto);
            });

            let msg = new imu.PoseUpdate(0, 0, -100, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('IOAction', () =>  {
        it("should translate `io.Action` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.IOAction();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                _wire.setIoAction(proto);
            });

            let msg = new io.Action(0, io.IOFlags.OUTPUT_ON);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('IOCommandMessage', () =>  {
        it("should translate `io.CommandRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandRequest(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `io.CommandSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandSubscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `io.CommandReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandReply(0, io.IOFlags.OUTPUT_ON);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `io.CommandUpdate` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                proto.setSubscription(sub);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandUpdate(0, io.IOFlags.OUTPUT_ON, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('AnalogMessage', () =>  {
        it("should translate `analog.Request` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Request(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `analog.Subscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Subscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `analog.Reply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setValue(1000);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Reply(0, 1000);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `analog.Update` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setValue(1000);
                proto.setSubscription(sub);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Update(0, 1000, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('DigitalMessage', () =>  {
        it("should translate `digital.Request` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Request(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `digital.Subscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Subscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `digital.Reply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setValue(true);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Reply(0, true);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `digital.Update` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setValue(true);
                proto.setSubscription(sub);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Update(0, true, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('MotorAction', () =>  {
        it("should translate `motor.Action` without amount successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorAction();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                _wire.setMotorAction(proto);
            });

            let msg = new motor.Action(0, motor.MotorState.POWER);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.Action` with amount successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorAction();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorAction(proto);
            });

            let msg = new motor.Action(0, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('MotorConfigAction', () =>  {
        it("should translate `motor.ConfigAction` for DC successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorConfigAction();
                proto.setPort(0);
                proto.setDc(new motor_pb.DcConfig());
                _wire.setMotorConfigAction(proto);
            });

            let msg = new motor.ConfigAction(0, { kind: motor.ConfigKind.DC });
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.ConfigAction` for ENCODER successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorConfigAction();
                proto.setPort(0);
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(0);
                config.setEncoderBPort(1);
                proto.setEncoder(config);
                _wire.setMotorConfigAction(proto);
            });

            let msg = new motor.ConfigAction(0, {
                kind: motor.ConfigKind.ENCODER,
                encoderAPort: 0,
                encoderBPort: 1,
            });
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.ConfigAction` for STEPPER successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorConfigAction();
                proto.setPort(0);
                proto.setStepper(new motor_pb.StepperConfig());
                _wire.setMotorConfigAction(proto);
            });

            let msg = new motor.ConfigAction(0, { kind: motor.ConfigKind.STEPPER });
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('MotorSetPositionAction', () =>  {
        it("should translate `motor.SetPositionAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorSetPositionAction();
                proto.setPort(0);
                proto.setPosition(0);
                _wire.setMotorSetPositionAction(proto);
            });

            let msg = new motor.SetPositionAction(0, 0);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('MotorCommandMessage', () =>  {
        it("should translate `motor.CommandRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandRequest(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.CommandSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandSubscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.CommandReply` for DC successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setDc(new motor_pb.DcConfig());
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandReply(0, { kind: motor.ConfigKind.DC }, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.CommandReply` for ENCODER successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(0);
                config.setEncoderBPort(1);
                proto.setEncoder(config);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandReply(0, {
                kind: motor.ConfigKind.ENCODER,
                encoderAPort: 0,
                encoderBPort: 1,
            }, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.CommandReply` for STEPPER successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setStepper(new motor_pb.StepperConfig());
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandReply(0, { kind: motor.ConfigKind.STEPPER }, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.CommandUpdate` for DC successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setDc(new motor_pb.DcConfig());
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandUpdate(0, { kind: motor.ConfigKind.DC }, motor.MotorState.POWER, 1000, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.CommandUpdate` for ENCODER successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                let config = new motor_pb.EncoderConfig();
                config.setEncoderAPort(0);
                config.setEncoderBPort(1);
                proto.setEncoder(config);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandUpdate(0, {
                kind: motor.ConfigKind.ENCODER,
                encoderAPort: 0,
                encoderBPort: 1,
            }, motor.MotorState.POWER, 1000, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.CommandUpdate` for STEPPER successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setStepper(new motor_pb.StepperConfig());
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandUpdate(0, { kind: motor.ConfigKind.STEPPER }, motor.MotorState.POWER, 1000, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('MotorStateMessage', () =>  {
        it("should translate `motor.StateRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateRequest(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.StateSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateSubscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `motor.StateReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setVelocity(0);
                proto.setPosition(0);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateReply(0, 0, 0);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `motor.StateUpdate` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setVelocity(0);
                proto.setPosition(0);
                proto.setSubscription(sub);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateUpdate(0, 0, 0, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('ServoAction', () =>  {
        it("should translate `servo.Action` without position successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoAction();
                proto.setPort(0);
                proto.setActive(false);
                _wire.setServoAction(proto);
            });

            let msg = new servo.Action(0, null);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `servo.Action` with position successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoAction();
                proto.setPort(0);
                proto.setActive(true);
                proto.setPosition(1000);
                _wire.setServoAction(proto);
            });

            let msg = new servo.Action(0, 1000);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('ServoCommandMessage', () =>  {
        it("should translate `servo.CommandRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandRequest(0);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `servo.CommandSubscribe` successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandSubscribe(0, sub);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `servo.CommandReply` without position successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(false);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandReply(0, null);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `servo.CommandReply` with position successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(true);
                proto.setPosition(1000);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandReply(0, 1000);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `servo.CommandUpdate` without position successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(false);
                proto.setSubscription(sub);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandUpdate(0, null, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });

        it("should translate `servo.CommandUpdate` with position successfully", () => {
            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);

            let wire = makeWire(_wire => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(true);
                proto.setPosition(1000);
                proto.setSubscription(sub);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandUpdate(0, 1000, sub);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('ProcessExecuteAction', () =>  {
        it("should translate `process.ExecuteAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessExecuteAction();
                proto.setArgsList(["cat"]);
                proto.setWorkingDir("/home/pi");
                _wire.setProcessExecuteAction(proto);
            });

            let msg = new process.ExecuteAction(["cat"], "/home/pi");
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('ProcessExecuteReply', () =>  {
        it("should translate `process.ExecuteReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessExecuteReply();
                proto.setPid(1234);
                _wire.setProcessExecuteReply(proto);
            });

            let msg = new process.ExecuteReply(1234);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('ProcessStreamMessage', () =>  {
        it("should translate `process.StreamAction` without chunk successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDIN);
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamAction(1234, process.ProcessFileno.STDIN);
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `process.StreamAction` with empty chunk successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDIN);
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamAction(1234, process.ProcessFileno.STDIN, Uint8Array.from('' as any));
            testMessage(msg, wire, protocol.RequestMsg);
        });

        it("should translate `process.StreamUpdate` with nonempty chunk successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDOUT);
                proto.setChunk(Uint8Array.from('\x00' as any));
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamUpdate(1234, process.ProcessFileno.STDOUT, Uint8Array.from('\x00' as any));
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('ProcessSignalAction', () =>  {
        it("should translate `process.SignalAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessSignalAction();
                proto.setPid(1234);
                proto.setSignal(9);
                _wire.setProcessSignalAction(proto);
            });

            let msg = new process.SignalAction(1234, 9);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('ProcessExitUpdate', () =>  {
        it("should translate `process.ExitUpdate` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new process_pb.ProcessExitUpdate();
                proto.setPid(1234);
                proto.setExitCode(0);
                _wire.setProcessExitUpdate(proto);
            });

            let msg = new process.ExitUpdate(1234, 0);
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('SpeakerAction', () =>  {
        it("should translate `speaker.Action` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new speaker_pb.SpeakerAction();
                proto.setFrequency(440);
                _wire.setSpeakerAction(proto);
            });

            let msg = new speaker.Action(440);
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `speaker.Action` for turning off successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new speaker_pb.SpeakerAction();
                proto.setFrequency(0);
                _wire.setSpeakerAction(proto);
            });

            let msg = new speaker.Action(null);
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('VisionCameraAction', () =>  {
        it("should translate `vision.OpenCameraAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionCameraAction();
                proto.setOpen(true);
                _wire.setVisionCameraAction(proto);
            });

            let msg = new vision.OpenCameraAction();
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.CloseCameraAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionCameraAction();
                proto.setOpen(false);
                _wire.setVisionCameraAction(proto);
            });

            let msg = new vision.CloseCameraAction();
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('VisionCaptureFrameAction', () =>  {
        it("should translate `vision.CaptureFrameAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionCaptureFrameAction();
                _wire.setVisionCaptureFrameAction(proto);
            });

            let msg = new vision.CaptureFrameAction();
            testMessage(msg, wire, protocol.RequestMsg);
        });
    });

    describe('VisionChannelMessage', () =>  {
        it("should translate `vision.CreateChannelAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionChannelMessage();
                proto.setOp(vision.ChannelOperation.CREATE);
                let channel = new vision_pb.Channel();
                channel.setKey('foo');
                channel.setFaces(new vision_pb.FacesChannel());
                proto.setChannelsList([channel]);
                _wire.setVisionChannelMessage(proto);
            });

            let msg = new vision.CreateChannelAction({
                foo: {
                    kind: vision.ChannelKind.FACES,
                },
            });
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.UpdateChannelAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionChannelMessage();
                proto.setOp(vision.ChannelOperation.UPDATE);
                let channel = new vision_pb.Channel();
                channel.setKey('foo');
                channel.setBlobs(new vision_pb.BlobsChannel());
                channel.getBlobs().setHsvMin(0x222222);
                channel.getBlobs().setHsvMax(0x888888);
                proto.setChannelsList([channel]);
                _wire.setVisionChannelMessage(proto);
            });

            let msg = new vision.UpdateChannelAction({
                foo: {
                    kind: vision.ChannelKind.BLOBS,
                    hsvMin: 0x222222,
                    hsvMax: 0x888888,
                },
            });
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.DeleteChannelAction` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionChannelMessage();
                proto.setOp(vision.ChannelOperation.DELETE);
                let channel = new vision_pb.Channel();
                channel.setKey('foo');
                proto.setChannelsList([channel]);
                _wire.setVisionChannelMessage(proto);
            });

            let msg = new vision.DeleteChannelAction(['foo']);
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.ChannelRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionChannelMessage();
                proto.setOp(vision.ChannelOperation.READ);
                let channel = new vision_pb.Channel();
                channel.setKey('foo');
                proto.setChannelsList([channel]);
                _wire.setVisionChannelMessage(proto);
            });

            let msg = new vision.ChannelRequest(['foo']);
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.ChannelReply` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionChannelMessage();
                proto.setOp(vision.ChannelOperation.READ);
                let channel = new vision_pb.Channel();
                channel.setKey('foo');
                channel.setFaces(new vision_pb.FacesChannel());
                proto.setChannelsList([channel]);
                _wire.setVisionChannelMessage(proto);
            });

            let msg = new vision.ChannelReply({
                foo: {
                    kind: vision.ChannelKind.FACES,
                },
            });
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('VisionFrameMessage', () =>  {
        it("should translate `vision.FrameRequest` without highlight successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFrameMessage();
                _wire.setVisionFrameMessage(proto);
            });

            let msg = new vision.FrameRequest(null);
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.FrameRequest` with highlight successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFrameMessage();
                proto.setHighlight('foo');
                _wire.setVisionFrameMessage(proto);
            });

            let msg = new vision.FrameRequest('foo');
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.FrameReply` without highlight successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFrameMessage();
                proto.setFrame(Uint8Array.from('' as any));
                _wire.setVisionFrameMessage(proto);
            });

            let msg = new vision.FrameReply(null, Uint8Array.from('' as any));
            testMessage(msg, wire, protocol.ReplyMsg);
        });
        it("should translate `vision.FrameReply` with highlight successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFrameMessage();
                proto.setHighlight('foo');
                proto.setFrame(Uint8Array.from('' as any));
                _wire.setVisionFrameMessage(proto);
            });

            let msg = new vision.FrameReply('foo', Uint8Array.from('' as any));
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });

    describe('VisionFeatureMessage', () =>  {
        it("should translate `vision.FeatureRequest` successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFeatureMessage();
                proto.setChannel('foo');
                _wire.setVisionFeatureMessage(proto);
            });

            let msg = new vision.FeatureRequest('foo');
            testMessage(msg, wire, protocol.RequestMsg);
        });
        it("should translate `vision.FeatureReply` with faces successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFeatureMessage();
                proto.setChannel('foo');
                proto.setFeature(new vision_pb.Feature());
                let faces = new vision_pb.FacesFeature();
                let face = new vision_pb.Face();
                face.setY(10);
                face.setWidth(100);
                face.setHeight(50);
                faces.setFacesList([face]);
                proto.getFeature().setFaces(faces);
                _wire.setVisionFeatureMessage(proto);
            });

            let msg = new vision.FeatureReply('foo', {
                kind: vision.ChannelKind.FACES,
                faces: [{
                    boundingRect: [0, 10, 100, 50],
                }],
            });
            testMessage(msg, wire, protocol.ReplyMsg);
        });
        it("should translate `vision.FeatureReply` with no faces successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFeatureMessage();
                proto.setChannel('foo');
                proto.setFeature(new vision_pb.Feature());
                proto.getFeature().setFaces(new vision_pb.FacesFeature());
                _wire.setVisionFeatureMessage(proto);
            });

            let msg = new vision.FeatureReply('foo', {
                kind: vision.ChannelKind.FACES,
                faces: [],
            });
            testMessage(msg, wire, protocol.ReplyMsg);
        });
        it("should translate `vision.FeatureReply` with blobs successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFeatureMessage();
                proto.setChannel('foo');
                proto.setFeature(new vision_pb.Feature());
                let blobs = new vision_pb.BlobsFeature();
                let blob = new vision_pb.Blob();
                blob.setY(10);
                blob.setWidth(100);
                blob.setHeight(50);
                blob.setCx(50);
                blob.setCy(35);
                blob.setConfidence(0.5);
                blobs.setBlobsList([blob]);
                proto.getFeature().setBlobs(blobs);
                _wire.setVisionFeatureMessage(proto);
            });

            let msg = new vision.FeatureReply('foo', {
                kind: vision.ChannelKind.BLOBS,
                blobs: [{
                    boundingRect: [0, 10, 100, 50],
                    centroid: [50, 35],
                    confidence: 0.5,
                }],
            });
            testMessage(msg, wire, protocol.ReplyMsg);
        });
        it("should translate `vision.FeatureReply` with no blobs successfully", () => {
            let wire = makeWire(_wire => {
                let proto = new vision_pb.VisionFeatureMessage();
                proto.setChannel('foo');
                proto.setFeature(new vision_pb.Feature());
                proto.getFeature().setBlobs(new vision_pb.BlobsFeature());
                _wire.setVisionFeatureMessage(proto);
            });

            let msg = new vision.FeatureReply('foo', {
                kind: vision.ChannelKind.BLOBS,
                blobs: [],
            });
            testMessage(msg, wire, protocol.ReplyMsg);
        });
    });
});
