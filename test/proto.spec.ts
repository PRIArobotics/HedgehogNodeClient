import "babel-polyfill";

import assert = require('assert');
import Ack from '../hedgehog/proto/ack';
import Analog from '../hedgehog/proto/analog';
import Digital from '../hedgehog/proto/digital';
import Io from '../hedgehog/proto/io';
import Motor from '../hedgehog/proto/motor';

describe('Proto', () => {

    describe('Ack', () => {
        let ackProto: Ack;

        beforeEach(() => {
            ackProto = new Ack();
        });

        describe('AcknowledgementCode', () => {
            it('should return the AcknowledgementCode OK (0) (if one code works, all codes work)', () => {
                assert.equal(0, ackProto.AcknowledgementCode.OK);
            });
        });

        describe('AcknowledgementMessage', () => {
            let acknowledgementMessage;

            it('should return a valid AcknowledgementMessage', () => {
                acknowledgementMessage = ackProto.parseAcknowledgement(ackProto.AcknowledgementCode.OK, 'Message');
                return acknowledgementMessage;
            });

            it('should return a valid serialized AcknowledgementMessage', () => {
                return ackProto.serialize(acknowledgementMessage);
            });
        });
    });

    describe('Analog', () => {
        let analogProto: Analog;

        beforeEach(() => {
            analogProto = new Analog();
        });

        describe('AnalogRequest', () => {
            let analogRequestMessage;

            it('should return a valid AnalogRequest', () => {
                analogRequestMessage = analogProto.parseAnalogRequest(0);
                return analogRequestMessage;
            });

            it('should return a valid serialized AnalogRequest', () => {
                return analogProto.serialize(analogRequestMessage);
            });
        });

        describe('AnalogUpdate', () => {
            let analogUpdateMessage;

            it('should return a valid AnalogUpdate', () => {
                analogUpdateMessage = analogProto.parseAnalogUpdate(0, 0);
                return analogUpdateMessage;
            });

            it('should return a valid serialized AnalogUpdate', () => {
                return analogProto.serialize(analogUpdateMessage);
            });
        });
    });

    describe('Digital', () => {
        let digitalProto: Digital;

        beforeEach(() => {
            digitalProto = new Digital();
        });

        describe('DigitalRequest', () => {
            let digitalRequestMessage;

            it('should return a valid DigitalRequest', () => {
                digitalRequestMessage = digitalProto.parseDigitalRequest(0);
                return digitalRequestMessage;
            });

            it('should return a valid serialized DigitalRequest', () => {
                return digitalProto.serialize(digitalRequestMessage);
            });
        });

        describe('DigitalUpdate', () => {
            let digitalUpdateMessage;

            it('should return a valid DigitalUpdate', () => {
                digitalUpdateMessage = digitalProto.parseDigitalUpdate(0, true);
                return digitalUpdateMessage;
            });

            it('should return a valid serialized DigitalUpdate', () => {
                return digitalProto.serialize(digitalUpdateMessage);
            });
        });
    });

    describe('Io', () => {
        let ioProto: Io;

        beforeEach(() => {
            ioProto = new Io();
        });

        describe('IOStateFlags', () => {
            it('should return the IOStateFlag INPUT_FLOATING (0x00) (if one code works, all codes work)', () => {
                assert.equal(0, ioProto.IOStateFlags.INPUT_FLOATING);
            });
        });

        describe('StateAction', () => {
            let stateActionMessage;

            it('should return a valid StateAction', () => {
                stateActionMessage = ioProto.parseStateAction(0, ioProto.IOStateFlags.OUTPUT);
                return stateActionMessage;
            });

            it('should return a valid serialized StateAction', () => {
                return ioProto.serialize(stateActionMessage);
            });

            describe('StateAction IOStateFlags handling', () => {
                it('should return true since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(true, ioProto.output(stateActionMessage));
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, ioProto.pullup(stateActionMessage));
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, ioProto.pulldown(stateActionMessage));
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, ioProto.level(stateActionMessage));
                });

                it('should return true since the StateAction has the PULLUP IOStateFlag', () => {
                    assert.equal(true, ioProto.pullup(ioProto.parseStateAction(0, ioProto.IOStateFlags.PULLUP)));
                });

                it('should return true since the StateAction has the PULLDOWN IOStateFlag', () => {
                    assert.equal(true, ioProto.pulldown(ioProto.parseStateAction(0, ioProto.IOStateFlags.PULLDOWN)));
                });

                it('should return true since the StateAction has the LEVEL IOStateFlag and OUTPUT', () => {
                    assert.equal(true, ioProto.level(
                        ioProto.parseStateAction(0, ioProto.IOStateFlags.LEVEL | ioProto.IOStateFlags.OUTPUT)));
                });

                it('should 1return an error since the StateAction a' +
                    'PULLUP or PULLDOWN flag requires an INPUT flag', () => {
                    assert.throws(() => ioProto.level(ioProto.parseStateAction(
                        0, ioProto.IOStateFlags.PULLUP | ioProto.IOStateFlags.OUTPUT)),
                        TypeError, "only input ports can be set to pullup or pulldown");

                    assert.throws(() => ioProto.level(ioProto.parseStateAction(
                        0, ioProto.IOStateFlags.PULLDOWN | ioProto.IOStateFlags.OUTPUT)),
                        TypeError, "only input ports can be set to pullup or pulldown");
                });

                it('should return an error since the StateAction has the' +
                    'LEVEL IOStateFlag and no OUTPUT', () => {
                    assert.throws(() => ioProto.level(ioProto.parseStateAction(
                        0, ioProto.IOStateFlags.LEVEL)), TypeError, "only output ports can be set to on");
                });

                it('should return an error since the StateAction has the' +
                    'PULLUP AND PULLDOWN and they are mutually exclusive', () => {
                    assert.throws(() => ioProto.level(ioProto.parseStateAction(
                        0, ioProto.IOStateFlags.PULLUP | ioProto.IOStateFlags.PULLDOWN)),
                        TypeError, "pullup and pulldown are mutually exclusive");
                });
            });
        });
    });

    describe('Motor', () => {
        let motorProto: Motor;

        beforeEach(() => {
            motorProto = new Motor();
        });

        describe('MotorState', () => {
            it('should return the MotorState POWER (0) (if one code works, all codes work)', () => {
                assert.equal(0, motorProto.MotorState.POWER);
            });
        });
    });
});
