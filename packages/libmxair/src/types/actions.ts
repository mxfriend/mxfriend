import { CallCommand } from '@mxfriend/common';
import { osc } from '@mxfriend/osc';
import { Command, Container, Property } from '@mxfriend/oscom';
import { UpdateNetworkMode } from './enums';

export class UpdateNetwork extends Command {
  $call(mode: UpdateNetworkMode): void {
    this.$emit('local-call', osc.compose('i', mode), this);
  }
}

export class SetClockCommand extends Command {
  $call(date: Date): void {
    const value = [
      date.getFullYear().toString(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0'),
    ].join('');

    this.$emit('local-call', osc.compose('s', value), this);
  }
}

export class Actions extends Container {
  @Property updnet: UpdateNetwork;
  @Property wlanscan: CallCommand;
  @Property initall: CallCommand;
  @Property savestate: CallCommand;
  @Property clearsolo: CallCommand;
  @Property setclock: SetClockCommand;
  @Property mididump: CallCommand;
}
