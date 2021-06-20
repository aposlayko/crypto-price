const fs = require('fs');
const { google } = require('googleapis');
var http = require('http');
const rp = require('request-promise');
const readline = require('readline');
var schedule = require('node-schedule');

const TAB = 'Portfolio';
const TICKER_RANGE = 'A2:A39';
const PRICE_RANGE = 'D2:D39';
const DEFAULT_CURRENCY = 'USD';
const SPREADSHEET_ID = '17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8';

// {
//   "googleApiKey": "AIzaSyDdD9INQluHYB_gl5BvxcebTEelRbPHRUQ",
//   "coinmarketcapApiKey": "ea37c2f8-80d4-4677-8177-41a1504cf51f",
//   "spreadsheetId": "17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8"
// }


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
let googleApiKey;
let coinmarketcapApiKey;



const job = schedule.scheduleJob('15 * * * * ', function () {
  // Load client secrets from a local file.
  fs.readFile('config.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);

    const configContent = JSON.parse(content);
    const { clientId, clientSecret } = configContent;

    googleApiKey = configContent.googleApiKey;
    coinmarketcapApiKey = configContent.coinmarketcapApiKey;

    authorize(clientId, clientSecret, startApp);
  });
});



async function startApp(auth) {
  const dataCells = await getDataCells(auth, TAB, TICKER_RANGE);
  
  const tickers = tranformDataCellsToTickerList(dataCells);
  const coinInfo = await getCoinInfo(coinmarketcapApiKey, tickers);
  
  const dataCellsToUpdate = transformToDataCells(dataCells, coinInfo);

  updateDataCells(auth, TAB, PRICE_RANGE, dataCellsToUpdate);   
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorize(clientId, clientSecret, callback) {  
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, 'https://google.com');

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
 function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
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
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function getDataCells(auth, tab, range) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4' });

    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      auth,
      range: `${tab}!${range}`,
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      
      console.log('Tickers loaded from ' + tab);
      resolve(res.data.values);      
    });
  });
}

function updateDataCells(auth, tab, range, dataCells) {
  const sheets = google.sheets({ version: 'v4' });  
  const request = {
    resource: {values: dataCells},
    range: `${tab}!${range}`,
    spreadsheetId: SPREADSHEET_ID,
    auth,
    valueInputOption: "USER_ENTERED",
  }
  
  sheets.spreadsheets.values.update(
    request,
    (err, response) => {
      if (err) {
        console.error(err);
        return;
      } 
      
      console.log('Prices updated!', new Date());
      console.log(' ');
    }
  );
}

// return [TICKER_NAME, ...]
function tranformDataCellsToTickerList(dataCells) {
  return dataCells.filter((o) => o[0]).map((o) => o[0]);
}

function transformToDataCells(dataCells, coinInfo) {
  return dataCells.map((o) => {
    return o[0] ? [coinInfo[o[0]]] : o;
  });
}

// return Promice<{COIN_NAME: price, ...}>
async function getCoinInfo(coinmarketcapApiKey, cryptoList = ['BTC', 'BNB']) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      qs: { 'symbol': cryptoList.join(',') },
      headers: { 'X-CMC_PRO_API_KEY': coinmarketcapApiKey },
      json: true,
      gzip: true
    };
  
    rp(options).then(response => {
      const info = {};
      
      if (response.data) {
        const data = response.data;

        for (let key in data) {        
          if (data[key]) {
            info[key] = data[key].quote[DEFAULT_CURRENCY].price;
          }
        }

        console.log('Prices loaded from coinmarketcap');
        resolve(info);  
      }   
    }).catch((err) => {
      console.log('API call error:', err.message);
    });
  });  
}