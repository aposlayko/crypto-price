import axios, { AxiosRequestConfig } from "axios";
import { config } from "../config";

export class CoinMarketCapService {
  static API_KEY: string = config.coinmarketcapApiKey;
  static DEFAULT_CURRENCY: string = 'USD';

  static getCoinInfo(cryptoList = ['BTC', 'BNB']): Promise<any> {
    return new Promise((resolve, reject) => {
      const options: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        params: { 'symbol': cryptoList.join(',') },
        headers: { 'X-CMC_PRO_API_KEY': CoinMarketCapService.API_KEY },
      };
        
      axios(options).then(response => {
        const info = {};            
            
        if (response?.data?.data) {
          const data = response.data.data;      
      
          for (let key in data) {        
            if (data[key]) {              
              info[key] = data[key].quote[CoinMarketCapService.DEFAULT_CURRENCY].price;
            }
          }
      
          console.log('Prices loaded from coinmarketcap');
          resolve(info);  
        }   
      }).catch((err) => {
        console.log('API call error:', err.message);
        reject(err);
      });
    });
  }
}