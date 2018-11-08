import { ContainerMessage } from '../../utils/protobuf';
import hedgehog = require('../proto/hedgehog_pb');

export { message, Message, ContainerMessage, ProtoContainerMessage } from '../../utils/protobuf';

export let PayloadCase = hedgehog.HedgehogMessage.PayloadCase;

// tslint:disable-next-line:variable-name
export let RequestMsg = new ContainerMessage(hedgehog.HedgehogMessage);
// tslint:disable-next-line:variable-name
export let ReplyMsg = new ContainerMessage(hedgehog.HedgehogMessage);

