import WebSocket from 'ws';
import { ServerKline } from './server-kline.interface';


interface ListenerSettings {
  symbol: string;     // 'btcusdt'
  timeframe: string;  // '1m'
}

export class KlineListener {
  ws: WebSocket;
  settings: ListenerSettings[];
  onMessage: (data: ServerKline) => void;

  constructor(settings: ListenerSettings[], onMessage: (data: any) => void) {
    this.settings = settings;
    this.onMessage = onMessage;
  }

  settingsToUrl(): string {
    return this.settings.map(o => `${o.symbol}@kline_${o.timeframe}`).join('/');    
  }

  start(): void {
    if (this.ws) {
      return;
    }
        
    const urlParams = this.settingsToUrl();
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${urlParams}`);

    this.ws.on('open', function() {
      console.log('socket open');
    });
    this.ws.on('error', function() {
        console.log('socket error');    
    });
    this.ws.on('close', function() {
        console.log('socket close');    
    });
    this.ws.on('message', (event: ArrayBuffer) => {
      const data = JSON.parse(event.toString());
      this.onMessage(data);
    });
  }

  stop() {
    this.ws.close();
    this.ws = null;    
  }
}