const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./user');

//import {Observable} from rxjs;

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'streamfeeder_admin',
  password : 'tacosandburritos',
  database : 'streamfeeder'
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection))
  .use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});