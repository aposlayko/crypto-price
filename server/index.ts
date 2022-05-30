import express from 'express'
import path from 'path';
import { algoMachineRouter } from './algo-machine/algo-machine.router';
import { analyticsRouter } from './analytics/analytic.router';
import { tradeAdvisorRouter } from './trade-advisor/trade-advisor.router';

const app = express();
const port = 3000;

console.log(path.join(__dirname, 'assets'));

app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../client/templates'));

app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

// ROUTER SECTION
app.use('/update-analytics', analyticsRouter);
app.use('/algo-machine', algoMachineRouter);
app.use('/trade-advisor', tradeAdvisorRouter);


app.get('/', (request, response) => {
    response.redirect('/update-analytics');
});
app.listen(port, () => console.log(`Running on http://localhost:${port}`));