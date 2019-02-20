export * from './client/hedgehogClient';
export { Message, ack, imu, io, analog, digital, motor, servo, process, speaker } from './protocol';

import * as protocol from './protocol';
export { protocol };
