const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");

const appCon = require("./controllers/app.controller");

mongoose.set('strictQuery', false);
const connect = mongoose.connect("mongodb://localhost:27017/garmnt",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => initialize())
    .catch(err => console.log(err));

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require('./routes/index');
app.use('/', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});

function initialize() {
  console.log('MongoDB connected, initializing essential collections');
  appCon.createOrUpdateLocales();
  appCon.createOrUpdateCountries();
  appCon.createOrUpdateRegionsL1();
  appCon.createOrUpdateRegionsL2();
}