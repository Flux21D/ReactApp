require('dotenv').config();

const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const app = express();

// Our port the application will listen on.
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const handlebars = expressHandlebars.create({});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'lib/public')));

require('./lib/routes/apiroutes')(app, express);

app.get('*', (req, res) => {
  return res.render('index', {layout: false});
});

app.get('/', (req, res) => {
  return res.render('index', {layout: false});
});
// app.post('/loggedin', (req, res) => {

//   console.log(req.body);
// });

app.set('trust proxy', 1); // trust first proxy

module.exports = app;
