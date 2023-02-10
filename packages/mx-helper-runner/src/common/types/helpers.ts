import { HelperState } from '@mxfriend/mx-helpers';
import { osc, OSCArgument } from '@mxfriend/osc';
import { Value } from '@mxfriend/oscom';

export type HelperInfo = [id: string, state: HelperState, name: string, icon?: string];

export type SelectionHelperState = {
  adapterId: string;
  mixerId: string;
  selection: string[];
  helpers: HelperInfo[];
};

export class HelperStateNode extends Value<SelectionHelperState | null> {
  $fromOSC(arg: OSCArgument, local: boolean = false, peer?: unknown): void {
    if (!osc.is.array(arg)) {
      this.$set(null, local, peer);
      return;
    }

    const [adapterId, mixerId, sel, helpers] = osc.extract(arg.value, 's', 's', 'a', 'a');

    if (adapterId) {
      const [selection = []] = osc.extract(sel, '...s');
      const state: SelectionHelperState = {
        adapterId,
        mixerId,
        selection,
        helpers: [],
      };

      for (const h of helpers.filter(osc.is.array)) {
        const [id, st, name, icon] = osc.extract(h.value, 's', 's', 's', 's?');

        if (id) {
          state.helpers.push([id, st as HelperState, name, icon]);
        }
      }

      this.$set(state, local, peer);
    }
  }

  $toOSC(): OSCArgument | undefined {
    const state = this.$get();

    if (!state) {
      return osc.null();
    }

    const v = state.helpers.map(([id, state, name, icon]) => osc.array(
      osc.string(id),
      osc.string(state),
      osc.string(name),
      osc.nullable.string(icon),
    ));

    return osc.array(
      osc.string(state.adapterId),
      osc.string(state.mixerId),
      osc.array(...state.selection.map(osc.string)),
      osc.array(...v),
    );
  }
}
