import { google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';
import { config } from '../config';
import { OAuth2Client } from 'google-auth-library';

class GoogleService {
  static SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
  static TOKEN_PATH = "token.json";
  oAuth2Client: OAuth2Client;

  constructor() {
    this.authorize(config.client_id, config.client_secret, config.redirect_uris[0]);
  }

  getCells(spreadsheetId: string, tab: string, range: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const sheets = google.sheets({ version: 'v4' });
  
      sheets.spreadsheets.values.get({
        spreadsheetId,
        auth: this.oAuth2Client,
        range:  `${tab}!${range}`,
      }, (err, res) => {
        if (err) {
          console.log('The API returned an error: ' + err);
          reject(err);
        } else {
          console.log('Tickers loaded from ' + tab);
          resolve(res.data.values);      
        }
      });
    });
  }

  updateCells(spreadsheetId: string, tab: string, range: string, data: any[][]): Promise<boolean> {
    const sheets = google.sheets({ version: 'v4' });

    const request = {
      resource: {values: data},
      range: `${tab}!${range}`,
      spreadsheetId,
      auth: this.oAuth2Client,
      valueInputOption: "USER_ENTERED",
    }
    
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.update(
        request,
        (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log('Prices updated!', new Date());
            console.log(' ');
            resolve(true);
          }
        }
      );
    });    
  }

  private authorize(clientId: string, clientSecret: string, redirectUrl: string): void {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "https://google.com"
    );

    // Check if we have previously stored a token.
    fs.readFile(GoogleService.TOKEN_PATH, (err, token: unknown) => {
      if (err) return this.getNewToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token as string));
      this.oAuth2Client = oAuth2Client;
    });
  }

  private getNewToken(oAuth2Client: OAuth2Client): void {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GoogleService.SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from that page (query param) here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        this.oAuth2Client = oAuth2Client;
        // Store the token to disk for later program executions
        fs.writeFile(GoogleService.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', GoogleService.TOKEN_PATH);
        });        
      });
    });
  }
}

export const googleService = new GoogleService();