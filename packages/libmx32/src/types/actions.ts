import { CallCommand, ClockRate } from '@mxfriend/common';
import { osc } from '@mxfriend/osc';
import { Command, Container, Property, StringValue } from '@mxfriend/oscom';

export class IntCommand<T extends number = number> extends Command {
  $call(arg: T): void {
    this.$emit('local-call', osc.compose('i', arg), this);
  }
}

export class SetClockCommand extends Command {
  $call(date: Date | string): void {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    date = [
      date.getFullYear(), date.getMonth() + 1, date.getDate(),
      date.getHours(), date.getMinutes(), date.getSeconds(),
    ].map(v => v.toString().padStart(2, '0')).join('');

    this.$emit('local-call', osc.compose('s', date), this);
  }
}

export class Actions extends Container {
  @Property setip: CallCommand;
  @Property setclock: SetClockCommand;
  @Property initall: CallCommand;
  @Property initlib: CallCommand;
  @Property initshow: CallCommand;
  @Property savestate: CallCommand;
  @Property undopt: CallCommand;
  @Property doundo: CallCommand;
  @Property playtrack: IntCommand<-1 | 1>;
  @Property newscreen: CallCommand;
  @Property clearsolo: CallCommand;
  @Property setprebus: CallCommand;
  @Property setsrate: IntCommand<ClockRate>;
  @Property setrtasrc: IntCommand;
  @Property recselect: IntCommand;
  @Property gocue: IntCommand;
  @Property goscene: IntCommand;
  @Property gosnippet: IntCommand;
  @Property selsession: IntCommand;
  @Property delsession: IntCommand;
  @Property selmarker: IntCommand;
  @Property delmarker: IntCommand;
  @Property savemarker: IntCommand;
  @Property addmarker: IntCommand;
  @Property setposition: IntCommand;
  @Property clearalert: IntCommand;
  @Property formatcard: IntCommand;
}

export class Undo extends Container {
  @Property time: StringValue;

  constructor() {
    super(true);
  }
}
