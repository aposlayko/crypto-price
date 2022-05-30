import WebSocket from 'ws';
import { Chart } from './chart';

export class KlineListener {
  ws: WebSocket;
  chart: Chart;

  start(): void {
    if (this.ws) {
      return;
    }
    this.chart = new Chart();
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');    

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
      this.chart.update(data);
    });
  }

  stop() {
    this.ws.close();
    this.ws = null;
    this.chart = null;
  }
}