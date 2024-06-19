import { EventEmitter } from '@mxfriend/osc';

export type ClientEvents = {
  expire: [client: Client];
};

const EXPIRATION_INTERVAL = 10_000;

export class Client extends EventEmitter<ClientEvents> {
  readonly ip: string;
  readonly port: number;
  updates: boolean = false;

  private updatesTmr?: NodeJS.Timeout;
  private expirationTmr?: NodeJS.Timeout;

  constructor(ip: string, port: number) {
    super();
    this.ip = ip;
    this.port = port;
    this.postponeExpiration();
  }

  subscribeUpdates(): void {
    this.updates = true;

    if (this.updatesTmr) {
      clearTimeout(this.updatesTmr);
    }

    this.updatesTmr = setTimeout(() => this.updates = false, EXPIRATION_INTERVAL);
    this.postponeExpiration();
  }

  postponeExpiration(): void {
    this.expirationTmr && clearTimeout(this.expirationTmr);
    this.expirationTmr = setTimeout(() => this.expire(), 3 * EXPIRATION_INTERVAL);
  }

  private expire(): void {
    this.emit('expire', this);
  }
}
