const fs = require('fs');
const { google } = require('googleapis');
var http = require('http');
const rp = require('request-promise');

const TAB = 'Portfolio';
const RANGE = 'A2:D39';
const DEFAULT_CURRENCY = 'USD';

// {
//   "googleApiKey": "AIzaSyDdD9INQluHYB_gl5BvxcebTEelRbPHRUQ",
//   "coinmarketcapApiKey": "ea37c2f8-80d4-4677-8177-41a1504cf51f",
//   "spreadsheetId": "17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8"
// }

// Load client secrets from a local file.
fs.readFile('config.json', (async (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);

  const { googleApiKey, coinmarketcapApiKey, spreadsheetId } = JSON.parse(content);

  const dataCells = await getDataCells(googleApiKey, spreadsheetId);
  const tickers = tranformDataCellsToTickerList(dataCells);
  const coinInfo = await getCoinInfo(coinmarketcapApiKey, tickers);
  console.log('Finish result', coinInfo);  
}));

async function getDataCells(auth, spreadsheetId) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4', auth });

    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${TAB}!${RANGE}`,
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      
      resolve(res.data.values);      
    });
  });
}

function setDataCells(auth, spreadsheetId) {
  const sheets = google.sheets({ version: 'v4', auth });
}

function tranformDataCellsToTickerList(dataCells) {
  return dataCells.filter((o) => o[0]).map((o) => o[0]);
}

// return Promice<[{COIN_NAME: price}, ...]>
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
      console.log('API call response:', response);
      if (response.data) {
        const data = response.data;

        for (let key in data) {        
          if (data[key]) {
            info[key] = data[key].quote[DEFAULT_CURRENCY].price;
          }
        }

        resolve(info);  
      }   
    }).catch((err) => {
      console.log('API call error:', err.message);
    });
  });  
}