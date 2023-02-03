import { Property, Root } from '@mxfriend/oscom';
import { MixerInfo, MixerStatus, ServerInfo } from './info';
import { NodeCommand, SlashCommand } from './node';
import {
  BatchSubscribeCommand,
  FormatSubscribeCommand,
  RenewCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  XRemoteCommand,
} from './subscriptions';


export class Mixer extends Root {
  @Property info: ServerInfo;
  @Property xinfo: MixerInfo;
  @Property status: MixerStatus;
  @Property '': SlashCommand;
  @Property node: NodeCommand;
  @Property xremote: XRemoteCommand;
  @Property xremotenfb: XRemoteCommand;
  @Property subscribe: SubscribeCommand;
  @Property formatsubscribe: FormatSubscribeCommand;
  @Property batchsubscribe: BatchSubscribeCommand;
  @Property renew: RenewCommand;
  @Property unsubscribe: UnsubscribeCommand;
}
