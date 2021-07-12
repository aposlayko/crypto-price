import express from 'express';
import { CoinMarketCapService } from './coinmarketcap.service';
import { googleService } from './google.service';
import { TransactionsListModel } from './transactions-list.mode';
import { hystoricalData } from './hystirical-data.service';

export const router = express.Router();

const SPREADSHEET_ID = '17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8';

const TRANSACTION_TAB = 'Transactions';
const ANALYTIC_TAB = 'Analytic';
const TRANSACTION_RANGE = 'A2:E'
const ANALYTIC_RANGE = 'A1:I';

router.post('/update', async (req, res) => {
  const response = await googleService.getCells(SPREADSHEET_ID, TRANSACTION_TAB, TRANSACTION_RANGE);
  const transactions = new TransactionsListModel(response);
  const tickerList = transactions.getUniqueNames();
  const coinInfo =  await CoinMarketCapService.getCoinInfo(tickerList);
  const analytic = transactions.getAnalytic(coinInfo);
  await googleService.clearCells(SPREADSHEET_ID, ANALYTIC_TAB, ANALYTIC_RANGE);
  const isUpdated = await googleService.updateCells(SPREADSHEET_ID, ANALYTIC_TAB, ANALYTIC_RANGE, TransactionsListModel.transformAnalyticToTableFormat(analytic));

  res.json(isUpdated);
});

router.post('/download-hystorical-data', (req, res) => {  
  const {interval, tiker} = req.body;

  const message = `Loading ${tiker} hystirical data with ${interval} interval...`;
  console.log(message);
  
  const getData = hystoricalData.getData(tiker, interval);
  getData.catch((err) => console.log(err));
  
  res.json({message});
});