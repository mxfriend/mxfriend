import { SceneLoader } from '@mxfriend/common';
import { Mixer } from '@mxfriend/libmxair';
import { EventEmitter } from '@mxfriend/osc';
import { UdpOSCPort } from '@mxfriend/osc/udp';
import { FactoryCache } from '@mxfriend/oscom';
import { readFile } from 'node:fs/promises';
import { Client } from './client';
import { MXAirEmulatorDispatcher } from './dispatcher';

type ClientFactory = (address: string, port: number) => Client;

export type EmulatorEvents = {
  connect: [client: Client];
  disconnect: [client: Client];
};

export class Emulator extends EventEmitter<EmulatorEvents> {
  readonly conn: UdpOSCPort;
  private readonly ip: string;
  private readonly clients: FactoryCache<ClientFactory>;
  private readonly dispatcher: MXAirEmulatorDispatcher;
  readonly mixer: Mixer;
  private meter: number = 0;

  constructor(conn: UdpOSCPort, ip: string) {
    super();
    this.conn = conn;
    this.ip = ip;
    this.clients = new FactoryCache(this.createClient.bind(this));
    this.mixer = new Mixer();
    this.dispatcher = new MXAirEmulatorDispatcher(conn, this.mixer, this.clients);
  }

  async start(): Promise<void> {
    await this.loadEmptyScene();
    await this.dispatcher.init();
    await this.conn.open();
    this.initMeters();
    setInterval(this.updateMeters.bind(this), 50);
  }

  private async loadEmptyScene(): Promise<void> {
    const scn = new SceneLoader();
    await scn.load(this.mixer, await readFile(__dirname + '/data/blank.scn', 'utf-8'));

    this.mixer.info.serverVersion.$set('1.0');
    this.mixer.xinfo.networkAddress.$set(this.ip);
    this.mixer.status.ip.$set(this.ip);

    const ip = this.ip.split(/\./g).map((v) => parseInt(v, 10));

    for (const [i, b] of ip.entries()) {
      this.mixer['-prefs'].lan.addr.$get(i).$set(b, true);
      i < 3 && this.mixer['-prefs'].lan.gateway.$get(i).$set(b, true);
    }
  }

  private createClient(address: string, port: number): Client {
    const client = new Client(this.dispatcher, this.mixer, address, port);

    client.once('expire', () => {
      this.clients.delete(address, port);
      this.emit('disconnect', client);
    });

    this.emit('connect', client);
    return client;
  }

  private initMeters(): void {
    for (const bank of this.mixer.meters) {
      bank.$fromDb(new Array(bank.$size).fill(-128), true);
    }
  }

  private updateMeters(): void {
    const value = Math.trunc(128 * (Math.sin(Math.PI * this.meter++ / 100) - 1)) / 2;

    for (const bank of this.mixer.meters) {
      bank.$fromDb(0, value, true);
    }
  }
}
