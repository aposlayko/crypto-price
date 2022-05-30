export interface ServerKline {
  e: 'kline',      // Event type
  E: number,       // Event time
  s: string,       // Symbol (aka BNBBTC, BTCUSDT)
  k: {
    t: number,     // Kline start time (123400000)
    T: number,     // Kline close time (123400000)
    s: string,     // Symbol (aka BNBBTC, BTCUSDT)
    i: string,     // Interval ("1m", "2m", "1h", "1d")
    f: number,     // First trade ID (100)
    L: number,     // Last trade ID (200)
    o: string,     // Open price ("0.0010")
    c: string,     // Close price ("0.0020")
    h: string,     // High price ("0.0025")
    l: string,     // Low price ("0.0015")
    v: string,     // Base asset volume ("1000")
    n: number,     // Number of trades (100)
    x: boolean,    // Is this kline closed? (false)
    q: string,     // Quote asset volume ("1.0000")
    V: string,     // Taker buy base asset volume ("500")
    Q: string,     // Taker buy quote asset volume ("0.500")
    B: string,     // Ignore ("123456")
  }
}

export interface Kline {
  openP: number;
  closeP: number;
  highP: number;
  lowP: number;
}
