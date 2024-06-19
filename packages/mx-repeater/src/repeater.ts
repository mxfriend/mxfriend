import { EventEmitter } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { FactoryCache } from '@mxfriend/oscom';
import { RepeaterAdapterInterface } from './adapters';
import { Client } from './client';
import { Dispatcher } from './dispatcher';

type ClientFactory = (ip: string, port: number) => Client;

export type RepeaterEvents = {
  connect: [client: Client];
  disconnect: [client: Client];
};

export class Repeater extends EventEmitter<RepeaterEvents> {
  /*private*/ readonly dispatcher: Dispatcher;
  private readonly clients: FactoryCache<ClientFactory>;

  constructor(
    port: UdpOSCPort,
    adapter: RepeaterAdapterInterface,
  ) {
    super();
    this.clients = new FactoryCache(this.createClient.bind(this));
    this.dispatcher = new Dispatcher(port, adapter, this.clients);
  }

  private createClient(ip: string, port: number): Client {
    const client = new Client(ip, port);

    client.once('expire', () => {
      this.clients.delete(ip, port);
      this.emit('disconnect', client);
    });

    this.emit('connect', client);
    return client;
  }
}
