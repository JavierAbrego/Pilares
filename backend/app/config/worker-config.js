var http = require('http');
var express = require('express');
var application = express();
var bodyParser = require('body-parser');
var routeConfig = require('./route-config');
var settingsConfig = require('./settings/settings-config');
var mongoose   = require('mongoose');


function configureWorker(application) {
  console.log(JSON.stringify(settingsConfig));
  configureApplication(application);
  configureRoutes(application);
  configureDatabase();

  startServer(application);

}

function configureApplication(application) {
  application.use(bodyParser.json());
  application.use(bodyParser.urlencoded());

  application.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.type('application/json');
    next();
  });
}

function configureRoutes(application) {
  routeConfig.registerRoutes(application);
}

function configureDatabase(){
  mongoose.connect(settingsConfig.settings.db, function(err) {
    if (err) throw err;
  });
}

function startServer(application) {
  var server = http.createServer(application);

  server.listen(settingsConfig.settings.workerPort, settingsConfig.settings.hostName, settingsConfig.settings.queueLength, function() {
    console.log('listening at http://%s:%s', settingsConfig.settings.hostName, settingsConfig.settings.workerPort);
  });
}

configureWorker(application);
