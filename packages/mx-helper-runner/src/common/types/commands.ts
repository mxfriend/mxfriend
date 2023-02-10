import { osc } from '@mxfriend/osc';
import { Command } from '@mxfriend/oscom';

export class ToggleHelperCommand extends Command {
  $call(adapterId: string, mixerId: string, helperId: string, on: boolean): void {
    this.$emit('local-call', osc.compose('s', adapterId, 's', mixerId, 's', helperId, 'B', on), this);
  }
}

export class ToggleMixerCommand extends Command {
  $call(adapterId: string, mixerId: string, on: boolean): void {
    this.$emit('local-call', osc.compose('s', adapterId, 's', mixerId, 'B', on), this);
  }
}
