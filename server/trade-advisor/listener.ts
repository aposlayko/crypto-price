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
  onClose: () => void;

  constructor(
    settings: ListenerSettings[],
     onMessage: (data: ServerKline) => void,
     onClose: () => void,
  ) {
    this.settings = settings;
    this.onMessage = onMessage;
    this.onClose = onClose
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

    this.ws.on('open', () => {
      console.log('socket open');
    });
    this.ws.on('error', () => {
        console.log('socket error');    
    });
    this.ws.on('close', () => {
      this.ws = null;
      this.onClose(); 
      console.log('socket close');    
    });
    this.ws.on('message', (event: ArrayBuffer) => {
      const data = JSON.parse(event.toString());
      this.onMessage(data);
    });
  }

  stop() {
    this.ws.close();    
  }
}