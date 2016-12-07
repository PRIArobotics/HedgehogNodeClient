import "babel-polyfill";


import assert = require('assert');
import { Acknowledgement } from '../hedgehog/proto/ack';
import { AnalogRequest, AnalogUpdate } from '../hedgehog/proto/analog';
import { DigitalRequest, DigitalUpdate } from '../hedgehog/proto/digital';
import { Command } from '../hedgehog/proto/hedgehog';
import { StateAction } from '../hedgehog/proto/io';
import { Action } from '../hedgehog/proto/motor';

describe('Proto', () => {

    describe('Ack', () => {
        let ackProto: Acknowledgement;

        beforeEach(() => {
            ackProto = new Acknowledgement(Acknowledgement.AcknowledgementCode.OK, 'Message');
        });

        describe('AcknowledgementMessage', () => {
            let acknowledgementMessage;

            it('should return a valid AcknowledgementMessage', () => {
                acknowledgementMessage = ackProto.parse();
                return acknowledgementMessage;
            });
        });
    });
/*
    describe('Analog', () => {
        let analogProto: Analog;

        beforeEach(() => {
            analogProto = new Analog();
            return analogProto.init();
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
            return digitalProto.init();
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
            return ioProto.init();
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
            return motorProto.init();
        });

        describe('MotorState', () => {
            it('should return the MotorState POWER (0) (if one code works, all codes work)', () => {
                assert.equal(0, motorProto.MotorState.POWER);
            });
        });

        describe('MotorAction', () => {
            let motorActionMessage;

            it('should return a valid MotorAction', () => {
                motorActionMessage = motorProto.parseAction(0, 0);
                return motorActionMessage;
            });

            it('should return throw an error that relativity and absolute are mutually exclusive', () => {
                assert.throws(() => motorActionMessage = motorProto.parseAction(0, 0, 0, 0, 0),
                    TypeError, "relative and absolute are mutually exclusive");
            });

            it('should return throw an error that reached_state must be kept at ' +
                'its default value for non-positional motor commands', () => {
                assert.throws(() => motorActionMessage = motorProto.parseAction(
                    0, 0, 0, undefined, undefined, motorProto.MotorState.BRAKE),
                    TypeError, "reached_state must be kept at its default value for non-positional motor commands");
            });

            it('should return a valid serialized StateAction', () => {
                return motorProto.serialize(motorActionMessage);
            });
        });

        describe('MotorRequest', () => {
            let motorRequestMessage;

            it('should return a valid MotorRequest', () => {
                motorRequestMessage = motorProto.parseRequest(0);
                return motorRequestMessage;
            });

            it('should return a valid serialized StateAction', () => {
                return motorProto.serialize(motorRequestMessage);
            });
        });

        describe('MotorUpdate', () => {
            let motorUpdateMessage;

            it('should return a valid MotorUpdate', () => {
                motorUpdateMessage = motorProto.parseUpdate(0, 0, 0);
                return motorUpdateMessage;
            });

            it('should return a valid serialized StateAction', () => {
                return motorProto.serialize(motorUpdateMessage);
            });
        });

        describe('MotorStateUpdate', () => {
            let motorStateUpdateMessage;

            it('should return a valid MotorStateUpdate', () => {
                motorStateUpdateMessage = motorProto.parseStateUpdate(0, 0);
                return motorStateUpdateMessage;
            });

            it('should return a valid serialized StateAction', () => {
                return motorProto.serialize(motorStateUpdateMessage);
            });
        });

        describe('MotorSetPositionAction', () => {
            let motorSetPositionActionMessage;

            it('should return a valid MotorSetPositionAction', () => {
                motorSetPositionActionMessage = motorProto.parseSetPositionAction(0, 0);
                return motorSetPositionActionMessage;
            });

            it('should return a valid serialized StateAction', () => {
                return motorProto.serialize(motorSetPositionActionMessage);
            });
        });
    });

    describe('Hedgehog', () => {
        let hedgehogProto: Hedgehog;
        let digitalProto: Digital;

        beforeEach( async () => {
            hedgehogProto = new Hedgehog();
            await hedgehogProto.init();
            digitalProto = new Digital();
            return digitalProto.init();
        });

        describe('HedgehogMessage', () => {
            it('HedgehogMessage test', () => {
                let digitalRequestMessage = digitalProto.parseDigitalRequest(0);

                hedgehogProto.parseHedgehogMessage(digitalRequestMessage);
            });
        });

    });
    */
});
