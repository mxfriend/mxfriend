import { osc, OSCArgument } from '@mxfriend/osc';
import { Command } from '@mxfriend/oscom';

export type CopyTarget = 'scene' | 'libchan' | 'libfx' | 'librout' | 'libmon';

export class CopyCommand extends Command {
  $call(target: CopyTarget, src: number, dst: number): void {
    this.$emit('local-call', osc.compose('s', target, 'i', src, 'i', dst), this);
  }
}

export class AddCueCommand extends Command {
  $call(numb: number, name: string): void {
    this.$emit('local-call', osc.compose('s', 'cue', 'i', numb, 's', name), this);
  }
}

export type CommandTarget = 'scene' | 'snippet' | 'libchan' | 'libfx' | 'librout' | 'libmon';

export class SaveCommand extends Command {
  $call(target: 'scene', index: number, name: string, note: string): void;
  $call(target: 'snippet', index: number, name: string): void;
  $call(target: 'libchan', preset: number, name: string, channel: number): void;
  $call(target: 'libfx', preset: number, name: string, fx: number): void;
  $call(target: 'librout', preset: number, name: string): void;
  $call(target: 'libmon', preset: number, name: string): void;
  $call(target: CommandTarget, idx: number, name: string, arg2?: any): void {
    const args: OSCArgument[] = osc.compose('s', target, 'i', idx, 's', name);

    switch (target) {
      case 'scene':
        args.push(osc.string(arg2));
        break;
      case 'libchan':
      case 'libfx':
        args.push(osc.int(arg2));
        break;
    }

    this.$emit('local-call', args, this);
  }
}

export class LoadCommand extends Command {
  $call(target: 'scene', index: number): void;
  $call(target: 'snippet', index: number): void;
  $call(target: 'libchan', preset: number, channel: number, scope: number): void;
  $call(target: 'libfx', preset: number, fx: number): void;
  $call(target: 'librout', preset: number): void;
  $call(target: 'libmon', preset: number): void;
  $call(target: CommandTarget, idx: number, dst?: number, scope?: number): void {
    this.$emit('local-call', osc.compose('s', target, 'i', idx, 'i?', dst, 'i?', scope), this);
  }
}

export class RenameCommand extends Command {
  $call(target: CommandTarget, index: number, name: string): void {
    this.$emit('local-call', osc.compose('s', target, 'i', index, 's', name), this);
  }
}

export class DeleteCommand extends Command {
  $call(target: CommandTarget, index: number): void {
    this.$emit('local-call', osc.compose('s', target, 'i', index), this);
  }
}

export class ShowDumpCommand extends Command {
  $call(): void {
    this.$emit('local-call', [], this);
  }
}
