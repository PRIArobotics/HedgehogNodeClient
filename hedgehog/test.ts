/**
 * Created by tfellner on 18.11.16.
 */

import Ack from './proto/ack';
import Analog from './proto/analog';
import Digital from './proto/digital';
import Io from './proto/io';
import Motor from './proto/motor';

/* Ack Test */
let ackProto = new Ack();
let ackAcknowledgementMessage = ackProto.parseAcknowledgement(0, "Message");

ackProto.serialize(ackAcknowledgementMessage);

/* Analog Test */
let analogProto = new Analog();
let analogRequestMessage = analogProto.parseAnalogRequest(0);
let analogUpdateMessage = analogProto.parseAnalogUpdate(0, 100);

analogProto.serialize(analogRequestMessage);
analogProto.serialize(analogUpdateMessage);

/* Digital Test */
let digitalProto = new Digital();
let digitalRequestMessage = digitalProto.parseDigitalRequest(0);
let digitalUpdateMessage = digitalProto.parseDigitalUpdate(0, 100);

digitalProto.serialize(digitalRequestMessage);
digitalProto.serialize(digitalUpdateMessage);

/* Io Test */
let ioProto = new Io();
let ioStateActionMessage = ioProto.parseStateAction(0, ioProto.IOStateFlags.INPUT_FLOATING);

ioProto.serialize(ioStateActionMessage);

/* Motor Test */
let motorProto = new Motor();
let motorActionMessage = motorProto.parseAction(0, 0, 100);

motorProto.serialize(motorActionMessage);
