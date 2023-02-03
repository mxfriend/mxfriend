import { AbstractOSCPort, OSCArgument, OSCMessage } from '@mxfriend/osc';


export async function query(port: AbstractOSCPort, address: string, args?: OSCArgument[], subscribe: string = address): Promise<OSCArgument[] | undefined> {
  return new Promise(async (resolve) => {
    let to: NodeJS.Timeout;
    let qi: NodeJS.Timeout;

    const done = (message: OSCMessage) => {
      cleanup();
      resolve(message.args);
    };

    const abort = () => {
      cleanup();
      resolve(undefined);
    };

    const cleanup = () => {
      port.unsubscribe(subscribe, done);
      to && clearTimeout(to);
      qi && clearInterval(qi);
    };

    port.subscribe(subscribe, done);
    await port.send(address, args);
    qi = setInterval(async () => port.send(address, args), 500);
    to = setTimeout(abort, 1250);
  });
}


export class TimeoutDetect {
  private readonly length: number;
  private readonly handler: () => void;
  private tmr?: NodeJS.Timeout;

  constructor(length: number, handler: () => void) {
    this.length = length;
    this.handler = handler;
    this.tmr = setTimeout(this.handler, this.length);
  }

  postpone(): void {
    clearTimeout(this.tmr);
    this.tmr = setTimeout(this.handler, this.length);
  }

  done(): void {
    clearTimeout(this.tmr);
  }
}
