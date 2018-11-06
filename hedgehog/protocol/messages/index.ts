import { ContainerMessage } from '../../utils/protobuf/index';
import hedgehog = require('../proto/hedgehog_pb');

export { message, Message, ProtoContainerMessage } from '../../utils/protobuf/index';

export let PayloadCase = hedgehog.HedgehogMessage.PayloadCase;

// tslint:disable-next-line:variable-name
export let RequestMsg = new ContainerMessage(hedgehog.HedgehogMessage);
// tslint:disable-next-line:variable-name
export let ReplyMsg = new ContainerMessage(hedgehog.HedgehogMessage);

