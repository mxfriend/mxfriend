import { osc } from '@mxfriend/osc';
import { Command } from '@mxfriend/oscom';

export class CallCommand extends Command {
  $call(): void {
    this.$emit('local-call', osc.compose('i', 1), this);
  }
}
