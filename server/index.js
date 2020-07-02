const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/key');
const routes = require('./routes');



// const config = require('./config/config');
// const { MONGO_URI, MONGO_DB_NAME } = process.env;
// const { MONGO_URI, MONGO_DB_NAME } = config;

const app = express();

// CORS Middleware
app.use(cors());
// Logger Middleware
app.use(morgan('dev'));
// Bodyparser Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Helmet helps you secure your Express apps by setting various HTTP headers. 
app.use(helmet());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) 
  .then(() => console.log(`MongoDB Connected by ${config.mongoURI}...`))
  .catch(err => console.log(err));

// Use Routes
app.use('/account', routes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  // console.log(__dirname);
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server Running at ${port}`)
});