const fs = require('fs');
const {google} = require('googleapis');

// {
//   "googleApiKey": "AIzaSyDdD9INQluHYB_gl5BvxcebTEelRbPHRUQ",
//   "coinmarketcapApiKey": "ea37c2f8-80d4-4677-8177-41a1504cf51f",
//   "spreadsheetId": "17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8"
// }

// Load client secrets from a local file.
fs.readFile('api-key.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  
  const {googleApiKey, coinmarketcapApiKey, spreadsheetId} = JSON.parse(content);  

  // listMajors(googleApiKey, spreadsheetId);
});

function listMajors(auth, spreadsheetId) {
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

function getPrices(coinmarketcapApiKey, cryptoList) {
}