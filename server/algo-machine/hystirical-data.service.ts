import axios, { AxiosRequestConfig } from "axios";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { resolve } from "path/posix";

class DateInterval {
  now: Date;
  dateStart: Date;
  dateEnd: Date;

  constructor(dateStart: string, dateEnd: string) {    
    this.now = new Date(dateStart);
    this.now.setDate(1);

    this.dateStart = new Date(dateStart);
    this.dateEnd = new Date(dateEnd);    
  }

  toPrevMonth(): boolean {
    const isOutOfRange = this.dateEnd > this.now;    
    
    this.now.setMonth(this.now.getMonth()-1);

    return isOutOfRange;
  }

  getYear(): string {
    return this.now.getFullYear().toString();
  }

  getMonth(): string {
    const result = this.now.getMonth() + 1;
    return result < 10 ? '0' + result : result.toString();
  }
}
class HystoricalData {
  static DIR_PATH = path.join(__dirname, "../../hystorical_data");
  static TEMP_DIR_PATH = path.join(__dirname, "../../temp_hystorical_data");

  constructor() {
    if (!fs.existsSync(HystoricalData.DIR_PATH)) {
      fs.mkdirSync(HystoricalData.DIR_PATH);
    }
  }

  async getData(tiker: string, interval: string, dateStart: string, dateEnd: string): Promise<boolean> {
    if (!tiker || !interval || !dateStart || !dateEnd) {
      throw 'missing parameters';
    }
    const tikerName = tiker.toUpperCase();
    const intervalValue = interval.toLowerCase();
    const fileName = `${tikerName}-${intervalValue}.csv`;
    const filePath = `${HystoricalData.DIR_PATH}/${fileName}`;
    const dateInterval = new DateInterval(dateStart, dateEnd);

    await this.removeFile(filePath);
    this.createTempFolder();
    const tempFilePathes = await this.getChunk(tikerName, intervalValue, dateInterval, []);
    return await this.joinFiles(filePath, tempFilePathes);
  }

  async getChunk(
    tikerName: string,
    interval: string,
    dateInterval: DateInterval,
    filePathes: string[],
  ): Promise<string[]> {    
    // URL example https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1m/BNBUSDT-1m-2019-01.zip
    const url = `https://data.binance.vision/data/spot/monthly/klines/${tikerName}/${interval}/${tikerName}-${interval}-${dateInterval.getYear()}-${dateInterval.getMonth()}.zip`;
    const tempFilePath = `${HystoricalData.TEMP_DIR_PATH}/temp${filePathes.length}`;
    
    console.log('Loading: ', url);
    
    try {
      const response = await this.loadData(url);
      const unzipedContent = this.unzipFirstFile(response);
      await this.appenToFile(unzipedContent, tempFilePath);
    } catch(err) {
      return new Promise((res, rej) => res(filePathes));
    }

    filePathes.push(tempFilePath);

    if (dateInterval.toPrevMonth()) {
      throw 'Out of range';
    }
        
    return await this.getChunk(tikerName, interval, dateInterval, filePathes);
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

  unzipFirstFile(zipFile: Buffer): Buffer {
    const zip = new AdmZip(zipFile);
    const zipEntries = zip.getEntries();

    return zipEntries[0].getData();
  }

  async joinFiles(mainFilePath: string, tempFilePathes: string[]): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      tempFilePathes.reverse();

      for(const path of tempFilePathes) {
        const data = await this.readFromFile(path);
        await this.appenToFile(data, mainFilePath);
      }

      resolve(true);
    });
  }

  appenToFile(content: Buffer, path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path,
        content,
        { flag: "w+" },
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

  readFromFile(path): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }        
      });
    })
  }

  createTempFolder() {
    const tempDirPath = HystoricalData.TEMP_DIR_PATH;

    if (!fs.existsSync(tempDirPath)) {
      fs.mkdirSync(tempDirPath);
    } else {
      const files = fs.readdirSync(tempDirPath);

      for (const file of files) {
        fs.unlinkSync(path.join(tempDirPath, file));
      }
    }
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
