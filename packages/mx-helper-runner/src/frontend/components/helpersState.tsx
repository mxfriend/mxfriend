import { HelperState } from '@mxfriend/mx-helpers';
import { FC, useCallback } from 'react';
import { SelectionHelperState } from '../../common';
import { useOm } from './om';
import { useOSCValue } from './osc';

const emptyState: SelectionHelperState = {
  adapterId: '',
  mixerId: '',
  selection: [],
  helpers: [],
};

export const HelpersState: FC = () => {
  const om = useOm();
  const state = useOSCValue(om?.state) ?? emptyState;
  const handleToggle = useCallback((adapterId: string, mixerId: string, helperId: string, on: boolean) => {
    om?.toggleHelper.$call(adapterId, mixerId, helperId, on);
  }, [om?.toggleHelper]);

  return (
    <>
      <ul className="selected-channels">{state.selection.map((ch, i) => <li key={i}>{ch}</li>)}</ul>
      <ul>{state.helpers.map(([id, hstate, name, icon]) => (
        <Helper
          key={id}
          adapterId={state.adapterId}
          mixerId={state.mixerId}
          helperId={id}
          state={hstate}
          name={name}
          icon={icon}
          onToggle={handleToggle} />
      ))}</ul>
    </>
  );
};

type HelperProps = {
  adapterId: string;
  mixerId: string;
  helperId: string;
  state: HelperState,
  name: string,
  icon?: string,
  onToggle: (adapterId: string, mixerId: string, helperId: string, on: boolean) => void;
};

const helperStates: Record<string, string> = {
  'active': 'on',
  'inactive': 'off',
  'unavailable': 'n/a',
};

const Helper: FC<HelperProps> = ({
  adapterId,
  mixerId,
  helperId,
  name,
  state,
  onToggle,
}) => (
  <li>
    <strong>{name}</strong>
    <button
      onClick={() => onToggle(adapterId, mixerId, helperId, state !== 'active')}
      className={state}
      disabled={state === 'unavailable'}>
      {helperStates[state]}
    </button>
  </li>
);
