import { Int16MeterBank, MeterBanks as MeterBanksCommon } from '@mxfriend/common';

const meterBankSizes = [
  8,   // channel strip: pre l+r, gate gr, comp gr, post l+r, gate key, comp key
  40,  // mix: 16x ch pre, aux pre l+r, fx1-4 pre l+r, bus1-6 pre, fxsend1-4 pre, main post l+r, mon l+r
  36,  // inputs: 16x preamp in, 2x aux in, 18x usb in
  56,  // fx: 4x (fx in l+r, 10x fx state mtr, fx out l+r)
  100, // rta
  44,  // outputs: 6x aux out, main l+r out, 16x ultranet out, 18x usb out, phones l+r
  39,  // dynamics: 16x ch gate gr, 16x ch comp gr, 6x bus comp gr, main comp gr
  16,  // automix: 16x ch automix gr
  4,   // dca: 4x dca (ch post)
  4,   // recorder: recorder in l+r, recorder out l+r
];

export class MeterBanks extends MeterBanksCommon<Int16MeterBank> {
  constructor() {
    super((i) => new Int16MeterBank(meterBankSizes[i]), { size: meterBankSizes.length, base: 0 });
  }

  get channel(): Int16MeterBank {
    return this.$get(0);
  }

  get mix(): Int16MeterBank {
    return this.$get(1);
  }

  get inputs(): Int16MeterBank {
    return this.$get(2);
  }

  get fx(): Int16MeterBank {
    return this.$get(3);
  }

  get rta(): Int16MeterBank {
    return this.$get(4);
  }

  get outputs(): Int16MeterBank {
    return this.$get(5);
  }

  get dynamics(): Int16MeterBank {
    return this.$get(6);
  }

  get automix(): Int16MeterBank {
    return this.$get(7);
  }

  get dca(): Int16MeterBank {
    return this.$get(8);
  }

  get recorder(): Int16MeterBank {
    return this.$get(9);
  }
}
