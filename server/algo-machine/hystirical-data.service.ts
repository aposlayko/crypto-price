import axios, { AxiosRequestConfig } from "axios";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

class DateInterval {
  month: number;
  year: number;

  constructor() {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
  }

  toPrevMonth() {
    if (this.month) {
      this.month -= 1;
    } else {
      this.month = 11;
      this.year -= 1;
    }
  }

  getYear(): string {
    return this.year.toString();
  }

  getMonth(): string {
    const result = this.month + 1;
    return result < 10 ? '0' + result : result.toString();
  }
}
class HystoricalData {
  static DIR_PATH = path.join(__dirname, "../../hystorical_data");

  constructor() {
    if (!fs.existsSync(HystoricalData.DIR_PATH)) {
      fs.mkdirSync(HystoricalData.DIR_PATH);
    }
  }

  async getData(tiker: string, interval: string): Promise<string> {
    if (!tiker || !interval) {
      throw 'missing parameters';
    }
    const tikerName = tiker.toUpperCase();
    const intervalValue = interval.toLowerCase();
    const fileName = `${tikerName}-${intervalValue}.csv`;
    const filePath = `${HystoricalData.DIR_PATH}/${fileName}`;
    const dateInterval = new DateInterval();

    dateInterval.toPrevMonth();
    
    await this.removeFile(filePath);

    return await this.getChunk(tikerName, intervalValue, dateInterval, filePath);
  }

  async getChunk(
    tikerName: string,
    interval: string,
    dateInterval: DateInterval,
    filePath: string
  ): Promise<string> {    
    // https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1m/BNBUSDT-1m-2019-01.zip
    const url = `https://data.binance.vision/data/spot/monthly/klines/${tikerName}/${interval}/${tikerName}-${interval}-${dateInterval.getYear()}-${dateInterval.getMonth()}.zip`;
    
    console.log('Loading: ', url);
    
    const response = await this.loadData(url);
    const unzipedContent = this.unzipFirstFile(response);
    const reversedContent = this.reverse(unzipedContent);
    await this.appenToFile(reversedContent, filePath);

    dateInterval.toPrevMonth();
        
    return await this.getChunk(tikerName, interval, dateInterval, filePath);
  }

  loadData(url: string): Promise<Buffer> {
    const options: AxiosRequestConfig = {
      method: "GET",
      url,
      responseType: "arraybuffer",
    };

    return new Promise((resolve, reject) => {
      axios(options)
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject;
          }
        })
        .catch((err) => {
          reject("Error while loading data, probably data ends");
        });
    });
  }

  reverse(csv: Buffer): Buffer {
    const csvStr = csv.toString().split('\n').reverse().join('\n');

    return Buffer.from(csvStr);
  }
 
  unzipFirstFile(zipFile: Buffer): Buffer {
    const zip = new AdmZip(zipFile);
    const zipEntries = zip.getEntries();

    return zipEntries[0].getData();
  }

  appenToFile(content: Buffer, path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path,
        content,
        { flag: "a+" },
        (err: NodeJS.ErrnoException) => {
          if (err) {
            console.log("Error while writing file", err);
            reject(err);
          }

          resolve(true);
        }
      );
    });
  }

  removeFile(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(path)) {
        resolve(true);
        return;
      }

      fs.unlink(path, (err) => {
        if (err) {
          console.log("Error while remove file", err);
          reject(false);
        }

        resolve(true);
      });
    });
  }

  getFileNameList(): string[] {
    return fs.readdirSync(HystoricalData.DIR_PATH);
  }

  getFolderPath(): string {
    return HystoricalData.DIR_PATH;
  }
}



export const hystoricalData = new HystoricalData();
