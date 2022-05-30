import express from 'express'
import { KlineListener } from './listener';
export const tradeAdvisorRouter = express.Router();

const klineListener = new KlineListener();

tradeAdvisorRouter.get('/', (req, res) => {
  res.render('trade-advisor');
});

tradeAdvisorRouter.post('/start', (req, res) => {
  klineListener.start();
  res.json({status: 200, meessage: 'OK'});
});

tradeAdvisorRouter.post('/stop', (req, res) => {
  klineListener.stop();
  res.json({status: 200, meessage: 'OK'});
});