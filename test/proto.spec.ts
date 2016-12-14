import "babel-polyfill";


import assert = require('assert');
import {Acknowledgement, AcknowledgementCode} from '../hedgehog/proto/ack';
import {AnalogRequest, AnalogUpdate} from '../hedgehog/proto/analog';
import {DigitalRequest, DigitalUpdate} from '../hedgehog/proto/digital';
import {Message} from '../hedgehog/proto/hedgehog';
import {StateAction, IOStateFlags} from '../hedgehog/proto/io';
import {Action} from '../hedgehog/proto/motor';

describe('Proto', () => {

    describe('Ack', () => {
        let acknowledgement: Acknowledgement;

        beforeEach(() => {
            acknowledgement = new Acknowledgement(AcknowledgementCode.OK, 'Message');
        });

        describe('AcknowledgementMessage', () => {
            let acknowledgementMessage;

            it('should return a valid AcknowledgementMessage', () => {
                acknowledgementMessage = acknowledgement.parse();
                return acknowledgementMessage;
            });
        });
    });

    describe('Analog', () => {
        describe('AnalogRequest', () => {
            let analogRequest: AnalogRequest;

            beforeEach(() => {
                analogRequest = new AnalogRequest(0);
            });

            let analogRequestMessage;

            it('should return a valid AnalogRequest', () => {
                analogRequestMessage = analogRequest.parse();
                return analogRequestMessage;
            });
        });

        describe('AnalogUpdate', () => {
            let analogUpdate: AnalogUpdate;

            beforeEach(() => {
                analogUpdate = new AnalogUpdate(0, 0);
            });

            let analogUpdateMessage;

            it('should return a valid AnalogUpdate', () => {
                analogUpdateMessage = analogUpdate.parse();
                return analogUpdateMessage;
            });
        });
    });

    describe('Digital', () => {
        describe('DigitalRequest', () => {
            let digitalRequest: DigitalRequest;

            beforeEach(() => {
                digitalRequest = new DigitalRequest(0);
            });

            let digitalRequestMessage;

            it('should return a valid DigitalRequest', () => {
                digitalRequestMessage = digitalRequest.parse();
                return digitalRequestMessage;
            });
        });

        describe('DigitalUpdate', () => {
            let digitalUpdate: DigitalUpdate;

            beforeEach(() => {
                digitalUpdate = new DigitalUpdate(0, true);
            });

            let digitalUpdateMessage;

            it('should return a valid DigitalUpdate', () => {
                digitalUpdateMessage = digitalUpdate.parse();
                return digitalUpdateMessage;
            });
        });
    });

    describe('Io', () => {

        describe('IOStateFlags', () => {
            it('should return the IOStateFlag INPUT_FLOATING (0x00) (if one code works, all codes work)', () => {
                assert.equal(0, IOStateFlags.INPUT_FLOATING);
            });
        });

        describe('StateAction', () => {
            let stateAction;

            beforeEach(() => {
                stateAction = new StateAction(0, IOStateFlags.OUTPUT);
            });

            let stateActionMessage;

            it('should return a valid StateAction', () => {
                stateActionMessage = stateAction.parse();
            });

            describe('StateAction IOStateFlags handling', () => {
                it('should return true since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(true, stateAction.output());
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, stateAction.pullup());
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, stateAction.pulldown());
                });

                it('should return false since the StateAction has an OUTPUT IOStateFlag', () => {
                    assert.equal(false, stateAction.level());
                });

                it('should return true since the StateAction has the PULLUP IOStateFlag', () => {
                    stateAction = new StateAction(0, IOStateFlags.PULLUP);

                    assert.equal(true, stateAction.pullup());
                });

                it('should return true since the StateAction has the PULLDOWN IOStateFlag', () => {
                    stateAction = new StateAction(0, IOStateFlags.PULLDOWN);

                    assert.equal(true, stateAction.pulldown());
                });

                it('should return true since the StateAction has the LEVEL IOStateFlag and OUTPUT', () => {
                    stateAction = new StateAction(0, IOStateFlags.LEVEL | IOStateFlags.OUTPUT);

                    assert.equal(true, stateAction.level(stateAction));
                });

                it('should return an error since the StateAction a ' +
                    'PULLUP or PULLDOWN flag requires an INPUT flag', () => {
                    assert.throws(() => new StateAction(0, IOStateFlags.PULLUP | IOStateFlags.OUTPUT),
                        TypeError, "only input ports can be set to pullup or pulldown");
                });

                it('should return an error since the StateAction has the ' +
                    'LEVEL IOStateFlag and no OUTPUT', () => {
                    assert.throws(() => new StateAction(0, IOStateFlags.LEVEL),
                        TypeError, "only output ports can be set to on");
                });

                it('should return an error since the StateAction has the ' +
                    'PULLUP AND PULLDOWN and they are mutually exclusive', () => {
                    assert.throws(() => new StateAction(0, IOStateFlags.PULLUP | IOStateFlags.PULLDOWN),
                        TypeError, "pullup and pulldown are mutually exclusive");
                });
            });
        });
    });

    /*
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
