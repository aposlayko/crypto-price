import express from 'express'
import path from 'path';

const app = express();
const port = 5000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', (request, response) => {
  response.render('index');
});
app.listen(port, () => console.log(`Running on http://localhost:${port}`));