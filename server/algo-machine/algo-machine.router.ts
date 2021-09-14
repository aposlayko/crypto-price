import express from 'express';
import path from "path";
import { AlgoMachine } from './algo-machine.model';
import { hystoricalData } from './hystirical-data.service';
import { QuoteList } from './quote-list.model';
import { Quote } from './quote.model';
import { QuotesDataType, QuotesEmitterService } from './quotes-emitter.service';

export const algoMachineRouter = express.Router();

algoMachineRouter.get('/', (req, res) => {
  res.render('algo-machine', {fileNames: hystoricalData.getFileNameList()});
});

algoMachineRouter.post('/download-hystorical-data', (req, res) => {  
  const {interval, tiker, dateStart, dateEnd} = req.body;

  const message = `Loading ${tiker} hystirical data with ${interval} interval from ${dateStart} to ${dateEnd}...`;
  console.log(message);
  
  const getData = hystoricalData.getData(tiker, interval, dateStart, dateEnd);
  getData.catch((err) => console.log(err));
  
  res.json({message});
});

algoMachineRouter.post('/start', (req, res) => {
  const {fileName, delay} = req.body;  
  
  const quotesEmitter = new QuotesEmitterService({
    delay: Number(delay),
    path: path.join(hystoricalData.getFolderPath(), '/' + fileName),
    type: QuotesDataType.File
  });

  const algoMachine = new AlgoMachine({
    emitter: quotesEmitter,
  }).start();

  res.json({ message: "Algo machiine is here" });
});