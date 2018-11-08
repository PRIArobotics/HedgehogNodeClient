import { ContainerMessage } from '../../utils/protobuf';
import { hedgehog_pb } from '../proto';

export { message, Message, ContainerMessage, ProtoContainerMessage } from '../../utils/protobuf';

export let PayloadCase = hedgehog_pb.HedgehogMessage.PayloadCase;

// tslint:disable-next-line:variable-name
export let RequestMsg = new ContainerMessage(hedgehog_pb.HedgehogMessage);
// tslint:disable-next-line:variable-name
export let ReplyMsg = new ContainerMessage(hedgehog_pb.HedgehogMessage);

