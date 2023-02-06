import { EventEmitter } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { FactoryCache } from '@mxfriend/oscom';
import { EmulatorAdapterInterface } from './adapters';
import { Client } from './client';
import { EmulatorDispatcher } from './dispatcher';

type ClientFactory = (address: string, port: number) => Client;

export type EmulatorEvents = {
  connect: [client: Client];
  disconnect: [client: Client];
};

export class Emulator extends EventEmitter<EmulatorEvents> {
  private readonly conn: UdpOSCPort;
  private readonly clients: FactoryCache<ClientFactory>;
  private readonly adapter: EmulatorAdapterInterface;
  private readonly dispatcher: EmulatorDispatcher;
  private readonly ip: string;
  private meter: number = -128;

  constructor(conn: UdpOSCPort, adapter: EmulatorAdapterInterface, ip: string) {
    super();
    this.conn = conn;
    this.clients = new FactoryCache(this.createClient.bind(this));
    this.adapter = adapter;
    this.dispatcher = new EmulatorDispatcher(conn, this.adapter, this.clients);
    this.ip = ip;
  }

  async start(): Promise<void> {
    await this.adapter.initMixer(this.ip);
    await this.dispatcher.init();
    await this.conn.open();
    this.initMeters();
    setInterval(this.updateMeters.bind(this), 50);
  }

  private createClient(address: string, port: number): Client {
    const client = new Client(this.adapter, this.dispatcher, address, port);

    client.once('expire', () => {
      this.clients.delete(address, port);
      this.emit('disconnect', client);
    });

    this.emit('connect', client);
    return client;
  }

  private initMeters(): void {
    for (const bank of this.adapter.getMeters()) {
      bank.$fromDb(new Array(bank.$size).fill(-128), true);
    }
  }

  private updateMeters(): void {
    const value = 30 * (-1 - Math.cos(Math.PI * this.meter++ / 100));

    for (const bank of this.adapter.getMeters()) {
      bank.$fromDb(0, value, true);
    }
  }
}
