import "@babel/polyfill";


import * as assert from 'assert';
import * as zmq from 'zeromq';

import { HedgehogClient, protocol, Message, ack, io, analog } from "../hedgehog";

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

    it('`getAnalog` should work', async () => {
        mock_server(
            [[new analog.Request(0)], [new analog.Reply(0, 0)]],
        );

        assert.strictEqual(await hedgehog.getAnalog(0), 0);
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
