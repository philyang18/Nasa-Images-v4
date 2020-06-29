var app = require('./app');
require('dotenv').config();
const {PORT} = process.env;
// const config = require('./config/config');
// const { PORT } = config;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));