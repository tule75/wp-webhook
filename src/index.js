const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
require('dotenv').config();
// const helmet = require('helmet');
const app = express();

const route = require('./routes/index');

// app.use(helmet())

app.use(cors());
const hostname = process.env.HOST || '15.235.168.162';
const port =  process.env.PORT || 3000
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// HTTP logger
app.use(morgan('combined'))

// Template Engine
app.engine(
    'hbs',
    engine({
      extname: '.hbs',
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/view'));

route(app);

app.listen(port, hostname, () => {
  console.log(`Example app listening on https://${hostname + ':' + port}`);
});