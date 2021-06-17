const fs = require('fs');
const {google} = require('googleapis');
var http = require('http');
const rp = require('request-promise');

// {
//   "googleApiKey": "AIzaSyDdD9INQluHYB_gl5BvxcebTEelRbPHRUQ",
//   "coinmarketcapApiKey": "ea37c2f8-80d4-4677-8177-41a1504cf51f",
//   "spreadsheetId": "17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8"
// }

// Load client secrets from a local file.
fs.readFile('config.json', (async (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  
  const {googleApiKey, coinmarketcapApiKey, spreadsheetId} = JSON.parse(content);  

  await getListOfTickers(googleApiKey, spreadsheetId);
  // getPrices(coinmarketcapApiKey);
}));

async function getListOfTickers(auth, spreadsheetId) {
  const sheets = google.sheets({version: 'v4', auth});

  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Portfolio!A2:C39',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log(res.data);
    const rows = res.data.values;
    if (rows.length) {            
      rows.map((row) => {
        console.log(row[0], row[2]);
      });
    } else {
      console.log('No data found.');
    }
  });
}

function getPrices(coinmarketcapApiKey, cryptoList = ['BTC', 'BNB']) {
  var options = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {'symbol': cryptoList.join(',')},
    headers: {'X-CMC_PRO_API_KEY': coinmarketcapApiKey},
    json: true,
    gzip: true
  };
  
  rp(options).then(response => {
    console.log('API call response:', response);
  }).catch((err) => {
    console.log('API call error:', err.message);
  });
}