// @ts-ignore
import { WebsocketOSCPort } from '@mxfriend/osc/websocket';
import { Dispatcher } from '@mxfriend/oscom';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { HelpersOM } from '../../common';
import { Children } from './types';

const Ctx = createContext<HelpersOM | undefined>(undefined);

export function useOm(): HelpersOM | undefined {
  return useContext(Ctx);
}

export const Om: FC<Children> = ({ children }) => {
  const [om, setOm] = useState<HelpersOM | undefined>(undefined);

  useEffect(() => {
    const conn = new WebsocketOSCPort(`ws://${location.host}/ws`);
    const dispatcher = new Dispatcher(conn);
    const om = new HelpersOM();
    dispatcher.add(Symbol('frontend'), om);
    conn.open().then(() => setOm(om));
  }, []);

  return (
    <Ctx.Provider value={om}>
      {children}
    </Ctx.Provider>
  );
};
