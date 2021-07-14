import express from 'express';
import path from "path";
import { hystoricalData } from './hystirical-data.service';
import { QuoteList } from './quote-list.model';
import { QuotesDataType, QuotesEmitterService } from './quotes-emitter.service';

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
  const {fileName, delay} = req.body;
  const quoteList = new QuoteList();
  
  const quotesEmitter = new QuotesEmitterService({
    delay: Number(delay),
    path: path.join(hystoricalData.getFolderPath(), '/' + fileName),
    type: QuotesDataType.File
  });

  quotesEmitter.start()
    .on("new-quote", (quoteStr: string) => {
      quoteList.addFromStr(quoteStr);
    })
    .on("close", () => {
      console.log(quoteList.reverse());
    });

  res.json({ message: "Algo machiine is here" });
});