import "babel-polyfill";


import assert = require('assert');

import * as ack from '../hedgehog/protocol/messages/ack';
import * as io from '../hedgehog/protocol/messages/io';
import * as analog from '../hedgehog/protocol/messages/analog';

import { HedgehogClient } from "../hedgehog/client/hedgehogClient";

// TODO make this CI-able, by mocking the Hedgehog server
describe.skip('Client', () => {
    let hedgehog = new HedgehogClient('tcp://localhost:10789');

    it('`send` should work', async () => {
        let result = await hedgehog.send(new io.Action(0, io.IOFlags.INPUT_PULLUP));
        assert.deepEqual(result, new ack.Acknowledgement());
    });

    it('`sendMultipart` should work', async () => {
        let [a, b] = await hedgehog.sendMultipart(
            new analog.Request(0),
            new analog.Request(1));
        assert.deepEqual(a, new analog.Reply(0, 0));
        assert.deepEqual(b, new analog.Reply(1, 0));
    });

    it('`getAnalog` should work', async () => {
        assert.equal(await hedgehog.getAnalog(0), 0);
    });
});
