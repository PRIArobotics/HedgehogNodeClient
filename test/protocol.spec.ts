import "babel-polyfill";


import assert = require('assert');

// tslint:disable:variable-name
let hedgehog_pb: any = require('../hedgehog/protocol/proto/hedgehog_pb');
let ack_pb: any = require('../hedgehog/protocol/proto/ack_pb');
let io_pb: any = require('../hedgehog/protocol/proto/io_pb');
let motor_pb: any = require('../hedgehog/protocol/proto/motor_pb');
let servo_pb: any = require('../hedgehog/protocol/proto/servo_pb');
let process_pb: any = require('../hedgehog/protocol/proto/process_pb');
let subscription_pb: any = require('../hedgehog/protocol/proto/subscription_pb');
// tslint:enable:variable-name

import { Message, ProtoContainerMessage, ContainerMessage } from '../hedgehog/utils/protobuf/index';
import { RequestMsg, ReplyMsg } from '../hedgehog/protocol/messages/index';
import * as ack from '../hedgehog/protocol/messages/ack';
import * as io from '../hedgehog/protocol/messages/io';
import * as analog from '../hedgehog/protocol/messages/analog';
import * as digital from '../hedgehog/protocol/messages/digital';
import * as motor from '../hedgehog/protocol/messages/motor';
import * as servo from '../hedgehog/protocol/messages/servo';
import * as process from '../hedgehog/protocol/messages/process';

describe('Protocol', () => {
    function testMessage(msg: Message, wire: ProtoContainerMessage, container: ContainerMessage) {
        let onWire = container.serialize(msg);
        assert.deepEqual(onWire, wire.serializeBinary());
        let received = container.parse(onWire);
        assert.deepEqual(received, msg);
    }

    function makeWire(fn: (wire) => void): ProtoContainerMessage {
        let wire = new hedgehog_pb.HedgehogMessage();
        fn(wire);
        return wire;
    }

    describe('Acknowledgement', () =>  {
        it("should translate `ack.Acknowledgement` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new ack_pb.Acknowledgement();
                proto.setCode(ack.AcknowledgementCode.OK);
                proto.setMessage('');
                _wire.setAcknowledgement(proto);
            });

            let msg = new ack.Acknowledgement();
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('IOAction', () =>  {
        it("should translate `io.Action` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.IOAction();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                _wire.setIoAction(proto);
            });

            let msg = new io.Action(0, io.IOFlags.OUTPUT_ON);
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('IOCommandMessage', () =>  {
        it("should translate `io.CommandRequest` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandRequest(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `io.CommandSubscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setIoCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new io.CommandSubscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `io.CommandReply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                _wire.setIoCommandMessage(proto);
            });

            let msg = new io.CommandReply(0, io.IOFlags.OUTPUT_ON);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `io.CommandUpdate` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.IOCommandMessage();
                proto.setPort(0);
                proto.setFlags(io.IOFlags.OUTPUT_ON);
                proto.setSubscription(sub);
                _wire.setIoCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new io.CommandUpdate(0, io.IOFlags.OUTPUT_ON, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('AnalogMessage', () =>  {
        it("should translate `analog.Request` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Request(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `analog.Subscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setAnalogMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new analog.Subscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `analog.Reply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setValue(1000);
                _wire.setAnalogMessage(proto);
            });

            let msg = new analog.Reply(0, 1000);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `analog.Update` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.AnalogMessage();
                proto.setPort(0);
                proto.setValue(1000);
                proto.setSubscription(sub);
                _wire.setAnalogMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new analog.Update(0, 1000, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('DigitalMessage', () =>  {
        it("should translate `digital.Request` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Request(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `digital.Subscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setDigitalMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new digital.Subscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `digital.Reply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setValue(true);
                _wire.setDigitalMessage(proto);
            });

            let msg = new digital.Reply(0, true);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `digital.Update` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new io_pb.DigitalMessage();
                proto.setPort(0);
                proto.setValue(true);
                proto.setSubscription(sub);
                _wire.setDigitalMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new digital.Update(0, true, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('MotorAction', () =>  {
        it("should translate `motor.Action` without amount successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorAction();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                _wire.setMotorAction(proto);
            });

            let msg = new motor.Action(0, motor.MotorState.POWER);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `motor.Action` with amount successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorAction();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorAction(proto);
            });

            let msg = new motor.Action(0, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('MotorSetPositionAction', () =>  {
        it("should translate `motor.SetPositionAction` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorSetPositionAction();
                proto.setPort(0);
                proto.setPosition(0);
                _wire.setMotorSetPositionAction(proto);
            });

            let msg = new motor.SetPositionAction(0, 0);
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('MotorCommandMessage', () =>  {
        it("should translate `motor.CommandRequest` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandRequest(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `motor.CommandSubscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new motor.CommandSubscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `motor.CommandReply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                _wire.setMotorCommandMessage(proto);
            });

            let msg = new motor.CommandReply(0, motor.MotorState.POWER, 1000);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `motor.CommandUpdate` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new motor_pb.MotorCommandMessage();
                proto.setPort(0);
                proto.setState(motor.MotorState.POWER);
                proto.setAmount(1000);
                proto.setSubscription(sub);
                _wire.setMotorCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new motor.CommandUpdate(0, motor.MotorState.POWER, 1000, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('MotorStateMessage', () =>  {
        it("should translate `motor.StateRequest` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateRequest(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `motor.StateSubscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setMotorStateMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new motor.StateSubscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `motor.StateReply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setVelocity(0);
                proto.setPosition(0);
                _wire.setMotorStateMessage(proto);
            });

            let msg = new motor.StateReply(0, 0, 0);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `motor.StateUpdate` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new motor_pb.MotorStateMessage();
                proto.setPort(0);
                proto.setVelocity(0);
                proto.setPosition(0);
                proto.setSubscription(sub);
                _wire.setMotorStateMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new motor.StateUpdate(0, 0, 0, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('ServoAction', () =>  {
        it("should translate `servo.Action` without position successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new servo_pb.ServoAction();
                proto.setPort(0);
                proto.setActive(false);
                _wire.setServoAction(proto);
            });

            let msg = new servo.Action(0, false);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `servo.Action` with position successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new servo_pb.ServoAction();
                proto.setPort(0);
                proto.setActive(true);
                proto.setPosition(1000);
                _wire.setServoAction(proto);
            });

            let msg = new servo.Action(0, true, 1000);
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('ServoCommandMessage', () =>  {
        it("should translate `servo.CommandRequest` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandRequest(0);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `servo.CommandSubscribe` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setSubscription(sub);
                _wire.setServoCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new servo.CommandSubscribe(0, sub);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `servo.CommandReply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(false);
                _wire.setServoCommandMessage(proto);
            });

            let msg = new servo.CommandReply(0, false, undefined);
            testMessage(msg, wire, ReplyMsg);
        });

        it("should translate `servo.CommandUpdate` successfully", () => {
            let wire = makeWire((_wire) => {
                let sub = new subscription_pb.Subscription();
                sub.setSubscribe(true);
                sub.setTimeout(10);

                let proto = new servo_pb.ServoCommandMessage();
                proto.setPort(0);
                proto.setActive(false);
                proto.setSubscription(sub);
                _wire.setServoCommandMessage(proto);
            });

            let sub = new subscription_pb.Subscription();
            sub.setSubscribe(true);
            sub.setTimeout(10);
            let msg = new servo.CommandUpdate(0, false, undefined, sub);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('ProcessExecuteAction', () =>  {
        it("should translate `process.ExecuteAction` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessExecuteAction();
                proto.setArgsList(["cat"]);
                proto.setWorkingDir("/home/pi");
                _wire.setProcessExecuteAction(proto);
            });

            let msg = new process.ExecuteAction(["cat"], "/home/pi");
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('ProcessExecuteReply', () =>  {
        it("should translate `process.ExecuteReply` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessExecuteReply();
                proto.setPid(1234);
                _wire.setProcessExecuteReply(proto);
            });

            let msg = new process.ExecuteReply(1234);
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('ProcessStreamMessage', () =>  {
        it("should translate `process.StreamAction` without chunk successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDIN);
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamAction(1234, process.ProcessFileno.STDIN);
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `process.StreamAction` with empty chunk successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDIN);
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamAction(1234, process.ProcessFileno.STDIN, Uint8Array.from(<any> ''));
            testMessage(msg, wire, RequestMsg);
        });

        it("should translate `process.StreamUpdate` with nonempty chunk successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessStreamMessage();
                proto.setPid(1234);
                proto.setFileno(process.ProcessFileno.STDOUT);
                proto.setChunk(Uint8Array.from(<any> '\x00'));
                _wire.setProcessStreamMessage(proto);
            });

            let msg = new process.StreamUpdate(1234, process.ProcessFileno.STDOUT, Uint8Array.from(<any> '\x00'));
            testMessage(msg, wire, ReplyMsg);
        });
    });

    describe('ProcessSignalAction', () =>  {
        it("should translate `process.SignalAction` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessSignalAction();
                proto.setPid(1234);
                proto.setSignal(9);
                _wire.setProcessSignalAction(proto);
            });

            let msg = new process.SignalAction(1234, 9);
            testMessage(msg, wire, RequestMsg);
        });
    });

    describe('ProcessExitUpdate', () =>  {
        it("should translate `process.ExitUpdate` successfully", () => {
            let wire = makeWire((_wire) => {
                let proto = new process_pb.ProcessExitUpdate();
                proto.setPid(1234);
                proto.setExitCode(0);
                _wire.setProcessExitUpdate(proto);
            });

            let msg = new process.ExitUpdate(1234, 0);
            testMessage(msg, wire, ReplyMsg);
        });
    });
});