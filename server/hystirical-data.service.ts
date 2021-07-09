import axios, { AxiosRequestConfig } from "axios";
import AdmZip from "adm-zip";
import fs from "fs";
import path from 'path';

class HystoricalData {
  static DIR_PATH = path.join(__dirname, "../hystorical_data");

  constructor() {
    if (!fs.existsSync(HystoricalData.DIR_PATH)) {
      fs.mkdirSync(HystoricalData.DIR_PATH);
    }
  }

  async getData(): Promise<string> {
    // remove file before loading if exists
        
    await this.getChunk('https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-01.zip');
    await this.getChunk('https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-02.zip');
    return await this.getChunk('https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-03.zip');    
  }

  getChunk(url: string): Promise<string> {
    // https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1m/BNBUSDT-1m-2019-01.zip
    const options: AxiosRequestConfig = {
      method: "GET",
      url,
      responseType: "arraybuffer",
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

          fs.writeFile(
            `${HystoricalData.DIR_PATH}/BNBUSDT.csv`,
            fileContent,
            { flag: "a+" },
            (err: NodeJS.ErrnoException) => {
              if (err) {
                console.log(err);
                reject(err);
              }

              resolve('chuks loaded');
            }
          );
        })
        .catch((err) => {
          console.log("Error:", err.message);
          reject(err);
        });
    });
  }
}

export const hystoricalData = new HystoricalData();
