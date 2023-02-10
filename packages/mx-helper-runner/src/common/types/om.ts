import { Property, Root } from '@mxfriend/oscom';
import { ToggleHelperCommand, ToggleMixerCommand } from './commands';
import { HelperStateNode } from './helpers';
import { MixerList } from './mixers';

export class HelpersOM extends Root {
  @Property mixers: MixerList;
  @Property state: HelperStateNode;
  @Property toggleHelper: ToggleHelperCommand;
  @Property toggleMixer: ToggleMixerCommand;
}
