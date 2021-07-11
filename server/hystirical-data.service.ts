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
    const name = "BNBUSDT";
    const interval = "1d";
    const fileName = `${name}-${interval}.csv`;
    const filePath = `${HystoricalData.DIR_PATH}/${fileName}`;

    await this.removeFile(filePath);

    await this.getChunk(
      "https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-01.zip",
      filePath
    );
    await this.getChunk(
      "https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-02.zip",
      filePath
    );
    return await this.getChunk(
      "https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1d/BNBUSDT-1d-2019-03.zip",
      filePath
    );
  }

  async getChunk(url: string, filePath: string): Promise<string> {
    // https://data.binance.vision/data/spot/monthly/klines/BNBUSDT/1m/BNBUSDT-1m-2019-01.zip
    const response = await this.loadData(url);
    const unzipedContent = this.unzipFirstFile(response);
    await this.appenToFile(unzipedContent, filePath);

    return "chuks loaded";
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
          console.log("Error while loading data", err);
          reject(err);
        });
    });
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
}

export const hystoricalData = new HystoricalData();
