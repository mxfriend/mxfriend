import { FC } from 'react';
import { HelpersState } from './helpersState';
import { MixerList } from './mixerList';
import { Om } from './om';

export const App: FC = () => (
  <Om>
    <MixerList />
    <HelpersState />
  </Om>
);
