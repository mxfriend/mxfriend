import { Mixer as MixerCommon } from '@mxfriend/common';
import { Property } from '@mxfriend/oscom';
import {
  AuxInList,
  BusList,
  ChannelList,
  DCAList,
  FxReturnList,
  MainList,
  MatrixList,
} from './channels';
import { Config } from './config';
import { FxList, InsertList } from './fx';
import { HaSourceList, HeadampList } from './headamps';
import { Outputs } from './outputs';

export class Mixer extends MixerCommon {
  @Property config: Config;
  @Property ch: ChannelList;
  @Property auxin: AuxInList;
  @Property fxrtn: FxReturnList;
  @Property bus: BusList;
  @Property mtx: MatrixList;
  @Property main: MainList;
  @Property dca: DCAList;
  @Property fx: FxList;
  @Property outputs: Outputs;
  @Property headamps: HeadampList;
  @Property '-ha': HaSourceList;
  @Property '-insert': InsertList;
}
