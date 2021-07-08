import axios, { AxiosRequestConfig } from "axios";
import AdmZip from "adm-zip";

class HystoricalData {
  getChunk() {
    // https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1m/BNBUSDT-1m-2019-01.zip
    const options: AxiosRequestConfig = {
      method: "GET",
      url: "https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-01.zip",
      responseType: 'arraybuffer',
    };

    return new Promise((resolve, reject) => {
      axios(options)
        .then((response) => {
          const zip = new AdmZip(response.data);
          const zipEntries = zip.getEntries();
          let fileContent: string;

          zipEntries.forEach(function (zipEntry) {
            console.log(zipEntry.toString()); // outputs zip entries information
            
            fileContent = zipEntry.getData().toString("utf8");            
          });
          
          console.log('Content', fileContent);
          
          resolve(fileContent);
        })
        .catch((err) => {
          console.log("Error:", err.message);
          reject(err);
        });
    });
  }
}

export const hystoricalData = new HystoricalData();
