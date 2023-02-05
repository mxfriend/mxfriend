import { Mixer as MixerCommon } from '@mxfriend/common';
import { Property } from '@mxfriend/oscom';
import { Actions } from './actions';
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
import { Prefs } from './prefs';
import {
  AddCueCommand,
  CopyCommand,
  DeleteCommand,
  LoadCommand,
  PresetLibrary,
  RenameCommand,
  SaveCommand,
  ShowData,
  ShowDumpCommand,
} from './showControl';
import { Stat } from './stat';
import { URec } from './urec';
import { USB } from './usb';

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
  @Property headamp: HeadampList;
  @Property '-ha': HaSourceList;
  @Property '-insert': InsertList;
  @Property '-show': ShowData;
  @Property '-libs': PresetLibrary;
  @Property copy: CopyCommand;
  @Property add: AddCueCommand;
  @Property save: SaveCommand;
  @Property load: LoadCommand;
  @Property rename: RenameCommand;
  @Property delete: DeleteCommand;
  @Property showdump: ShowDumpCommand;
  @Property '-action': Actions;
  @Property '-prefs': Prefs;
  @Property '-usb': USB;
  @Property '-stat': Stat;
  @Property '-urec': URec;
}
