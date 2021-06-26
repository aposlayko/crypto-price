import express from 'express'
import path from 'path';
import { router } from './analytic.router';

const app = express();
const port = 3000;

console.log(path.join(__dirname, 'assets'));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/update-analytics', router);

app.get('/', (request, response) => {
    response.render('index');
});
app.listen(port, () => console.log(`Running on http://localhost:${port}`));