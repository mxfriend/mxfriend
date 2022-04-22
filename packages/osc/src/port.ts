import { Socket, RemoteInfo, createSocket } from 'dgram';
import { EventEmitter } from 'events';
import { OSCBundle, OSCMessage, isMessage } from './types';
import { decode, encodeMessage, encodeBundle } from './utils';

export type OSCPortOptions = {
  localAddress?: string;
  localPort?: number;
  remoteAddress?: string;
  remotePort?: number;
  broadcast?: boolean;
};

export class OSCPort extends EventEmitter {
  private readonly options: OSCPortOptions;
  private readonly sock: Socket;

  constructor(options: OSCPortOptions = {}) {
    super();
    this.options = options;
    this.sock = createSocket('udp4');
  }

  async open(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.sock.once('error', reject);

      this.sock.bind(this.options.localPort ?? 0, this.options.localAddress ?? '0.0.0.0', () => {
        this.sock.off('error', reject);
        resolve();
      });
    });

    if (this.options.broadcast) {
      this.sock.setBroadcast(true);
    }

    this.sock.on('error', (err) => this.emit('error', err));
    this.sock.on('message', (msg, info) => this.emit(...(decode(msg) as [any, any]), info));
  }

  async send(message: OSCMessage | OSCBundle, remoteAddress?: string, remotePort?: number): Promise<void> {
    if (isMessage(message)) {
      await this.sendMessage(message, remoteAddress, remotePort);
    } else {
      await this.sendBundle(message, remoteAddress, remotePort);
    }
  }

  async sendMessage(message: OSCMessage, remoteAddress?: string, remotePort?: number): Promise<void> {
    await this.sendPacket(encodeMessage(message), remoteAddress, remotePort);
  }

  async sendBundle(bundle: OSCBundle, remoteAddress?: string, remotePort?: number): Promise<void> {
    await this.sendPacket(encodeBundle(bundle), remoteAddress, remotePort);
  }

  private async sendPacket(packet: Buffer, remoteAddress?: string, remotePort?: number): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.sock.send(packet, remotePort ?? this.options.remotePort, remoteAddress ?? this.options.remoteAddress, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }
}

export interface OSCPort extends EventEmitter {
  emit(event: 'error', err: any): boolean;
  emit(event: 'message', message: OSCMessage, info: RemoteInfo): boolean;
  emit(event: 'bundle', bundle: OSCBundle, info: RemoteInfo): boolean;

  on(event: 'error', listener: (err: any) => void): this;
  on(event: 'message', listener: (message: OSCMessage, info: RemoteInfo) => void): this;
  on(event: 'bundle', listener: (bundle: OSCBundle, info: RemoteInfo) => void): this;

  once(event: 'error', listener: (err: any) => void): this;
  once(event: 'message', listener: (message: OSCMessage, info: RemoteInfo) => void): this;
  once(event: 'bundle', listener: (bundle: OSCBundle, info: RemoteInfo) => void): this;

  off(event: 'error', listener: (err: any) => void): this;
  off(event: 'message', listener: (message: OSCMessage, info: RemoteInfo) => void): this;
  off(event: 'bundle', listener: (bundle: OSCBundle, info: RemoteInfo) => void): this;
}
