const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose"); 
const https = require('https');
const fs = require('fs');
const path = require('path');
const appController = require("./controllers/app.controller");
const userController = require("./controllers/user.controller");
const routes = require('./routes/index');

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

app.use('/', routes);

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const options = {
  key: fs.readFileSync('files/certs/key.pem'),
  cert: fs.readFileSync('files/certs/certificate.pem')
};
https.createServer(options, app).listen(443, () => {
  console.log(`https server listening on 443`)
})

function initialize() {
  console.log('MongoDB connected, initializing essential collections');
  appController.createOrUpdateLanguages();
  appController.createOrUpdateRegionsL0();
  appController.createOrUpdateCountries();
  appController.createOrUpdateRegionsL1();
  appController.createOrUpdateRegionsL2();
  userController.createOrUpdateRoles();
}