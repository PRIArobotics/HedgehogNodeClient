import "@babel/polyfill";


import * as assert from 'assert';
import * as zmq from 'zeromq';

import { HedgehogClient, protocol, Message, ack, version, emergency, io, analog, digital, motor, servo } from "../hedgehog";

describe('Client', () => {
    let server = null;
    let hedgehog = null;

    before(() => {
        server = zmq.socket('router');
        server.bindSync('tcp://*:0');
    });

    before(() => {
        hedgehog = new HedgehogClient(server.last_endpoint);
    });

    async function mock_server(...pairs: Array<[Message[], Message[]]>) {
        function recv() {
            return new Promise<Buffer[]>((resolve, reject) => {
                server.once('message', (...parts: Buffer[]) => {
                    setTimeout(() => {
                        resolve(parts);
                    }, 0);
                });
            });
        }

        for(let [expected, responses] of pairs) {
            let [ident, delimiter, ...data] = await recv();
            let requests = data.map(msg => protocol.RequestMsg.parse(msg));

            assert.deepStrictEqual(requests, expected);

            server.send([
                ident, delimiter,
                ...responses.map(msg => Buffer.from(protocol.ReplyMsg.serialize(msg)))
            ]);
        }
    }

    it('`send` should work', async () => {
        mock_server(
            [[new io.Action(0, io.IOFlags.INPUT_PULLUP)], [new ack.Acknowledgement()]],
        );

        let result = await hedgehog.send(new io.Action(0, io.IOFlags.INPUT_PULLUP));
        assert.deepStrictEqual(result, new ack.Acknowledgement());
    });

    it('`sendMultipart` should work', async () => {
        mock_server(
            [[new analog.Request(0), new analog.Request(1)],
                [new analog.Reply(0, 0), new analog.Reply(1, 0)]],
        );

        let [a, b] = await hedgehog.sendMultipart(
            new analog.Request(0),
            new analog.Request(1));
        assert.deepStrictEqual(a, new analog.Reply(0, 0));
        assert.deepStrictEqual(b, new analog.Reply(1, 0));
    });

    it('`getVersion` should work', async () => {
        let versionResult = {
            ucId: Uint8Array.from('\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' as any),
            hardwareVersion: "3",
            firmwareVersion: "0",
            serverVersion: "0.9.0a2",
        };

        mock_server(
            [[new version.Request()], [new version.Reply(versionResult.ucId, versionResult.hardwareVersion, versionResult.firmwareVersion, versionResult.serverVersion)]],
        );

        assert.deepStrictEqual(await hedgehog.getVersion(), versionResult);
    });

    it('`setEmergencyStop` should work', async () => {
        mock_server(
            [[new emergency.Action(true)], [new ack.Acknowledgement()]],
        );

        await hedgehog.setEmergencyStop(true);
    });

    it('`getEmergencyStop` should work', async () => {
        mock_server(
            [[new emergency.Request()], [new emergency.Reply(false)]],
        );

        assert.strictEqual(await hedgehog.getEmergencyStop(), false);
    });

    it('`setInputState` should work', async () => {
        mock_server(
            [[new io.Action(0, io.IOFlags.INPUT_PULLUP)], [new ack.Acknowledgement()]],
        );

        await hedgehog.setInputState(0, true);
    });

    it('`getAnalog` should work', async () => {
        mock_server(
            [[new analog.Request(0)], [new analog.Reply(0, 0)]],
        );

        assert.strictEqual(await hedgehog.getAnalog(0), 0);
    });

    it('`getDigital` should work', async () => {
        mock_server(
            [[new digital.Request(0)], [new digital.Reply(0, true)]],
        );

        assert.strictEqual(await hedgehog.getDigital(0), true);
    });

    it('`setDigitalOutput` should work', async () => {
        mock_server(
            [[new io.Action(0, io.IOFlags.OUTPUT_ON)], [new ack.Acknowledgement()]],
        );

        await hedgehog.setDigitalOutput(0, true);
    });

    it('`getIOConfig` should work', async () => {
        mock_server(
            [[new io.CommandRequest(0)], [new io.CommandReply(0, io.IOFlags.INPUT_PULLUP)]],
        );

        assert.strictEqual(await hedgehog.getIOConfig(0), io.IOFlags.INPUT_PULLUP);
    });

    it('`configureMotor` should work', async () => {
        mock_server(
            [[new motor.ConfigAction(0, {kind: motor.ConfigKind.DC})], [new ack.Acknowledgement()]],
        );

        await hedgehog.configureMotor(0, {kind: motor.ConfigKind.DC});
    });

    it('`moveMotor` should work', async () => {
        mock_server(
            [[new motor.Action(0, motor.MotorState.POWER, 1000)], [new ack.Acknowledgement()]],
        );

        await hedgehog.moveMotor(0, 1000);
    });

    it('`moveRelativePosition` should work', async () => {
        mock_server(
            [[new motor.Action(0, motor.MotorState.POWER, 1000, motor.MotorState.POWER, -1000, undefined)], [new ack.Acknowledgement()]],
        );

        await hedgehog.moveRelativePosition(0, 1000, -1000);
    });

    it('`moveAbsolutePosition` should work', async () => {
        mock_server(
            [[new motor.Action(0, motor.MotorState.POWER, 1000, motor.MotorState.POWER, undefined, -1000)], [new ack.Acknowledgement()]],
        );

        await hedgehog.moveAbsolutePosition(0, 1000, -1000);
    });

    it('`getMotorCommand` should work', async () => {
        mock_server(
            [[new motor.CommandRequest(0)], [new motor.CommandReply(0, {kind: motor.ConfigKind.DC}, motor.MotorState.POWER, 1000)]],
        );

        assert.deepStrictEqual(await hedgehog.getMotorCommand(0), [motor.MotorState.POWER, 1000]);
    });

    it('`getMotorState` should work', async () => {
        mock_server(
            [[new motor.StateRequest(0)], [new motor.StateReply(0, 0, 0)]],
        );

        assert.deepStrictEqual(await hedgehog.getMotorState(0), [0, 0]);
    });

    it('`setMotorPosition` should work', async () => {
        mock_server(
            [[new motor.SetPositionAction(0, 0)], [new ack.Acknowledgement()]],
        );

        await hedgehog.setMotorPosition(0, 0);
    });

    it('`setServo` should work', async () => {
        mock_server(
            [[new servo.Action(0, null)], [new ack.Acknowledgement()]],
            [[new servo.Action(0, 1000)], [new ack.Acknowledgement()]],
        );

        await hedgehog.setServo(0, null);
        await hedgehog.setServo(0, 1000);
    });

    it('`getServoPosition` should work', async () => {
        mock_server(
            [[new servo.CommandRequest(0)], [new servo.CommandReply(0, null)]],
            [[new servo.CommandRequest(0)], [new servo.CommandReply(0, 1000)]],
        );

        assert.strictEqual(await hedgehog.getServoPosition(0), null);
        assert.strictEqual(await hedgehog.getServoPosition(0), 1000);
    });

    after(() => {
        hedgehog.close();
        hedgehog = null;
    });

    after(() => {
        server.close();
        server = null;
    });
});
