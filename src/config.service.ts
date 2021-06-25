import { Config } from "./interfaces/config.interface";
import fs from 'fs';

export class ConfigService {
    config: Config;

    constructor(fileName: string) {
        this.readFile(fileName);
    }

    async readFile(path: string): Promise<Config> {
        return new Promise((resolve, reject) => {
            fs.readFile('config.json', (err, content) => {
                const jsonText = content as unknown;
                if (err) {
                    console.log('Error loading client secret file:', err);
                    reject('Error loading client secret file:');
                } else {
                    resolve(<Config>JSON.parse(jsonText as string));
                }    
            });
        });
        
    }
}