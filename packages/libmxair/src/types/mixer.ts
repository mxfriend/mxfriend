import { Property } from '@mxfriend/oscom';
import { Mixer as MixerCommon } from '@mxfriend/common';
import { Actions } from './actions';
import {
  BusList,
  ChannelList,
  DCAList,
  FxSendList,
  LR,
  ReturnList,
} from './channels';
import { Config } from './config';
import { FxList } from './fx';
import { HeadampList } from './headamps';
import { MeterBanks } from './meters';
import { Prefs } from './prefs';
import { Routing } from './routing';
import { SnapshotList } from './snapshots';
import { Stat } from './stat';

export class Mixer extends MixerCommon {
  @Property '-prefs': Prefs;
  @Property '-snap': SnapshotList;
  @Property '-stat': Stat;
  @Property '-action': Actions;
  @Property config: Config;
  @Property ch: ChannelList;
  @Property rtn: ReturnList;
  @Property bus: BusList;
  @Property fxsend: FxSendList;
  @Property lr: LR;
  @Property dca: DCAList;
  @Property fx: FxList;
  @Property routing: Routing;
  @Property headamp: HeadampList;
  @Property meters: MeterBanks;
}
