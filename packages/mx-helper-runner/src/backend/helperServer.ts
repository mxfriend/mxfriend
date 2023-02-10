import { StaticHandler, StaticRoute } from '@insaner/static';
import { Duplex } from 'stream';
import { WebSocket, WebSocketServer } from 'ws';
import { HttpRequest, HttpServer } from 'insaner';
import { HelperRunner } from './helperRunner';

export class HelperServer {
  private readonly http: HttpServer = new HttpServer();
  private readonly ws: WebSocketServer = new WebSocketServer({ noServer: true });
  private readonly runner: HelperRunner;

  constructor(runner: HelperRunner) {
    this.runner = runner;
  }

  async start(): Promise<void> {
    this.http.router.add(new StaticRoute('/'), new StaticHandler(__dirname + '/../frontend', ['index.html']));
    this.http.on('upgrade', this.handleUpgrade.bind(this));
    this.ws.on('connection', this.handleConnection.bind(this));
    await this.http.listen(8000);
  }

  private async handleUpgrade(request: HttpRequest, socket: Duplex, head: Buffer): Promise<void> {
    if (!/^\/ws$/.test(request.url.pathname)) {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }

    const conn = await new Promise((resolve) => {
      this.ws.handleUpgrade(request.raw, socket, head, resolve);
    });

    this.ws.emit('connection', conn, request);
  }

  private async handleConnection(conn: WebSocket): Promise<void> {
    await this.runner.addClient(conn);
  }
}
