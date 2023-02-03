import { osc, OSCArgument } from '@mxfriend/osc';
import { Collection } from '@mxfriend/oscom';
import { AbstractMeterBank } from '../oscom';


export class MeterBanks<TBank extends AbstractMeterBank> extends Collection<TBank> {
  get $callable(): boolean {
    return true;
  }

  $handleCall(peer?: unknown, ...args: OSCArgument[]): OSCArgument[] | undefined {
    const [addr, rng] = osc.validate(args, 's', '...i');

    if (!addr || !/^\/meters\/\d+$/.test(addr.value)) {
      return;
    }

    const bankId = parseInt(addr.value.substring(8), 10);

    if (bankId < 0 || bankId >= this.$size) {
      return undefined;
    }

    this.$get(bankId).$handleCall(peer, ...rng);
    return undefined;
  }
}
