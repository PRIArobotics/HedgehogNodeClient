import "babel-polyfill";

import assert = require('assert');
import Ack from '../../hedgehog/proto/ack';
import Analog from '../../hedgehog/proto/analog';
import Digital from '../../hedgehog/proto/digital';
import Motor from '../../hedgehog/proto/motor';

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

        describe('AcknowledgementMessage',() => {
            it('should return a valid AcknowledgementMessage', () => {
                return ackProto.parseAcknowledgement(ackProto.AcknowledgementCode.OK, 'Message');
            });
        });

        describe('AcknowledgementMessage Serialization',() => {
            it('should return a valid serialized AcknowledgementMessage', () => {
                return ackProto.serialize(ackProto.parseAcknowledgement(ackProto.AcknowledgementCode.OK, 'Message'));
            });
        });
    });

    describe('Analog', () => {
        let analogProto: Analog;

        beforeEach(() => {
            analogProto = new Analog();
        });

        describe('AnalogRequest',() => {
            it('should return a valid AnalogRequest', () => {
                return analogProto.parseAnalogRequest(0);
            });
        });

        describe('AnalogUpdate',() => {
            it('should return a valid AnalogUpdate', () => {
                return analogProto.parseAnalogUpdate(0, 0);
            });
        });

        describe('AnalogRequest Serialization',() => {
            it('should return a valid serialized AnalogRequest', () => {
                return analogProto.serialize(analogProto.parseAnalogRequest(0));
            });
        });

        describe('AnalogUpdate Serialization',() => {
            it('should return a valid serialized AnalogUpdate', () => {
                return analogProto.serialize(analogProto.parseAnalogUpdate(0, 0));
            });
        });
    });

    describe('Digital', () => {
        let digitalProto: Digital;

        beforeEach(() => {
            digitalProto = new Digital();
        });

        describe('DigitalRequest',() => {
            it('should return a valid DigitalRequest', () => {
                return digitalProto.parseDigitalRequest(0);
            });
        });

        describe('DigitalUpdate',() => {
            it('should return a valid DigitalUpdate', () => {
                return digitalProto.parseDigitalUpdate(0, 0);
            });
        });

        describe('DigitalRequest Serialization',() => {
            it('should return a valid serialized DigitalRequest', () => {
                return digitalProto.serialize(digitalProto.parseDigitalRequest(0));
            });
        });

        describe('DigitalUpdate Serialization',() => {
            it('should return a valid serialized DigitalUpdate', () => {
                return digitalProto.serialize(digitalProto.parseDigitalUpdate(0, 0));
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
