export * from './client/hedgehogClient';
export { Message, ack, version, emergency, imu, io, analog, digital, motor, servo, process, speaker } from './protocol';

import * as protocol from './protocol';
export { protocol };
