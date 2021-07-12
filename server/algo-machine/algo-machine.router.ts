import express from 'express';
import { hystoricalData } from './hystirical-data.service';

export const algoMachineRouter = express.Router();

algoMachineRouter.post('/download-hystorical-data', (req, res) => {  
  const {interval, tiker} = req.body;

  const message = `Loading ${tiker} hystirical data with ${interval} interval...`;
  console.log(message);
  
  const getData = hystoricalData.getData(tiker, interval);
  getData.catch((err) => console.log(err));
  
  res.json({message});
});

algoMachineRouter.post('/start', (req, res) => {
  res.json({message: 'Algo machiine is here'});
});