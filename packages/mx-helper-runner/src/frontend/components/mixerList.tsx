import { FC, useCallback } from 'react';
import { MixerState } from '../../common';
import { useOm } from './om';
import { useOSCValue } from './osc';

export const MixerList: FC = () => {
  const om = useOm();
  const list = useOSCValue(om?.mixers) ?? [];
  const handleToggle = useCallback((adapterId: string, mixerId: string, on: boolean) => {
    om?.toggleMixer.$call(adapterId, mixerId, on);
  }, [om?.toggleMixer]);

  return (
    <ul>
      {list.map((mixer, i) => <MixerListEntry key={i} mixer={mixer} onToggle={handleToggle} />)}
    </ul>
  );
};

type MixerListEntryProps = {
  mixer: MixerState;
  onToggle: (adapterId: string, mixerId: string, on: boolean) => void;
};

const MixerListEntry: FC<MixerListEntryProps> = ({ mixer: [adapterId, mixerId, name, active], onToggle }) => (
  <li>
    <strong>{name}</strong>
    <button onClick={() => onToggle(adapterId, mixerId, !active)}>{active ? 'dis' : ''}connect</button>
  </li>
);
