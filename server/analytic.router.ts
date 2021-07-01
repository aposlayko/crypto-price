import express, { RequestHandler } from 'express';
import { CoinMarketCapService } from './coinmarketcap.service';
import { googleService } from './google.service';
import { TransactionsListModel } from './transactions-list.mode';

export const router = express.Router();

const TAB = 'Portfolio';
const TICKER_RANGE = 'A2:A39';
const PRICE_RANGE = 'D2:D39';
const SPREADSHEET_ID = '17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8';

const TRANSACTION_TAB = 'Transactions';
const TRANSACTION_RANGE = 'A2:E'

router.post('/update-old', async (req: any, res: any) => {
  const response = await googleService.getCells(SPREADSHEET_ID, TAB, TICKER_RANGE);
  const tickerList = response.filter((o) => o[0]).map((o) => o[0]);
  const coinInfo =  await CoinMarketCapService.getCoinInfo(tickerList);
  const responseWithPrice = response.map((o) => {
    return o[0] ? [coinInfo[o[0]]] : o;
  });
  const isUpdated = await googleService.updateCells(SPREADSHEET_ID, TAB, PRICE_RANGE, responseWithPrice);

  res.json({isUpdated});
});

router.post('/update', async (req, res) => {
  const response = await googleService.getCells(SPREADSHEET_ID, TRANSACTION_TAB, TRANSACTION_RANGE);
  const transactions = new TransactionsListModel(response);
  res.json({result: transactions.getAnalytic('LTC')});
})