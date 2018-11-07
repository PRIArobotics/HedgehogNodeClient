import "@babel/polyfill";


import assert = require('assert');
import zmq = require('zeromq');

import * as ack from '../hedgehog/protocol/messages/ack';
import * as io from '../hedgehog/protocol/messages/io';
import * as analog from '../hedgehog/protocol/messages/analog';

import { Message, RequestMsg, ReplyMsg } from '../hedgehog/protocol/messages/index';
import { HedgehogClient } from "../hedgehog/client/hedgehogClient";

describe('Client', () => {
    let server = null;
    let hedgehog = null;

    before(() => {
        // TODO the server terminates slowly for some reason
        server = zmq.socket('router');
        server.bindSync('inproc://controller');
    });

    before(() => {
        hedgehog = new HedgehogClient('inproc://controller');
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
            let parts = await recv();
            let [ident, delimiter, ...data] = parts;
            let requests = data.map(msg => RequestMsg.parse(msg));

            assert.deepEqual(requests, expected);

            server.send([
                ident, delimiter,
                ...responses.map(msg => Buffer.from(ReplyMsg.serialize(msg)))
            ]);
        }
    }

    it('`send` should work', async () => {
        mock_server(
            [[new io.Action(0, io.IOFlags.INPUT_PULLUP)], [new ack.Acknowledgement()]],
        );

        let result = await hedgehog.send(new io.Action(0, io.IOFlags.INPUT_PULLUP));
        assert.deepEqual(result, new ack.Acknowledgement());
    });

    it('`sendMultipart` should work', async () => {
        mock_server(
            [[new analog.Request(0), new analog.Request(1)],
                [new analog.Reply(0, 0), new analog.Reply(1, 0)]],
        );

        let [a, b] = await hedgehog.sendMultipart(
            new analog.Request(0),
            new analog.Request(1));
        assert.deepEqual(a, new analog.Reply(0, 0));
        assert.deepEqual(b, new analog.Reply(1, 0));
    });

    it('`getAnalog` should work', async () => {
        mock_server(
            [[new analog.Request(0)], [new analog.Reply(0, 0)]],
        );

        assert.equal(await hedgehog.getAnalog(0), 0);
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
