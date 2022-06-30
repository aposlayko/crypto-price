import express from 'express';
import { CoinMarketCapService } from './coinmarketcap.service';
import { googleService } from './google.service';
import { TransactionsListModel } from './transactions-list.mode';
import { TransactionList } from './transaction-list.model';

export const analyticsRouter = express.Router();

const SPREADSHEET_ID = '17D4eYUyrYZepfIx85B2_R6ccU9GocaVyEBsCyKoHUJ8';

const TRANSACTION_TAB = 'Transactions';
const TRANSACTION_TAB_V2 = 'Transactions_v2';
const ANALYTIC_TAB = 'Analytic';
const TRANSACTION_RANGE = 'A2:E'
const TRANSACTION_RANGE_V2 = 'A2:F'
const ANALYTIC_RANGE = 'A1:K';

analyticsRouter.get('/', (req, res) => {
  res.render('update-analytics');
});

analyticsRouter.post('/update', async (req, res) => {
  try {
    const response = await googleService.getCells(SPREADSHEET_ID, TRANSACTION_TAB, TRANSACTION_RANGE);
    const transactions = new TransactionsListModel(response);
    const tickerList = transactions.getUniqueNames();
    const coinInfo =  await CoinMarketCapService.getCoinInfo(tickerList);
    const analytic = transactions.getAnalytic(coinInfo);
    await googleService.clearCells(SPREADSHEET_ID, ANALYTIC_TAB, ANALYTIC_RANGE);
    const isUpdated = await googleService.updateCells(SPREADSHEET_ID, ANALYTIC_TAB, ANALYTIC_RANGE, TransactionsListModel.transformAnalyticToTableFormat(analytic));
    res.json({isUpdated});
  } catch(err) {
    res.json(err);
  }
});

analyticsRouter.get('/refresh_token', (req, res) => {
  res.render('refresh_token');
});

analyticsRouter.post('/refresh_token', (req, res) => {
  googleService.refreshToken(req.body.code);
  res.json(true);
});

analyticsRouter.post('/update-v2', async (req, res) => {
  try {
    const response = await googleService.getCells(SPREADSHEET_ID, TRANSACTION_TAB_V2, TRANSACTION_RANGE_V2);
    const transactions = new TransactionList(response as [string, string, string, string, string, string][]);
    const tickerList = transactions.getUniqueNames();
    const coinInfo =  await CoinMarketCapService.getCoinInfo(tickerList);
    const analytic = transactions.getAnalytic(coinInfo);
    console.log(analytic);
    res.json({isUpdated: true});
  } catch(err) {
    res.json(err);
  }
});
