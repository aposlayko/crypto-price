import express, { response } from 'express';
import { CoinMarketCapService } from './coinmarketcap.service';
import { googleService } from './google.service';

export const router = express.Router();

const TAB = 'Portfolio';
const TICKER_RANGE = 'A2:A39';
const PRICE_RANGE = 'D2:D39';
const SPREADSHEET_ID = '17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8';

router.post('/', async (req: any, res: any) => {
  const response = await googleService.getCells(SPREADSHEET_ID, TAB, TICKER_RANGE);
  const tickerList = response.filter((o) => o[0]).map((o) => o[0]);
  const coinInfo =  await CoinMarketCapService.getCoinInfo(tickerList);
  const responseWithPrice = response.map((o) => {
    return o[0] ? [coinInfo[o[0]]] : o;
  });
  const isUpdated = await googleService.updateCells(SPREADSHEET_ID, TAB, PRICE_RANGE, responseWithPrice);

  res.json({isUpdated});
});