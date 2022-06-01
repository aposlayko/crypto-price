import express from 'express'
import { TradeAdvisor } from './trade-advisor';
export const tradeAdvisorRouter = express.Router();

const tradeAdvisor = new TradeAdvisor();

tradeAdvisorRouter.get('/', (req, res) => {
  res.render('trade-advisor');
});

tradeAdvisorRouter.post('/start', (req, res) => {
  tradeAdvisor.start();
  res.json({status: 200, meessage: 'OK'});
});

tradeAdvisorRouter.post('/stop', (req, res) => {
  tradeAdvisor.stop();
  res.json({status: 200, meessage: 'OK'});
});