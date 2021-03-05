//import { Observable } from 'rxjs';

const express = require('express');
const bodyParser = require('body-parser');
const Rx = require('rxjs');

function createRouter(db) {
  const router = express.Router();
  var id = Math.floor(Math.random() * 100000);  
  const password = "test";
  const Fname = "testing";
  const Lname = "testing";
  const Email = "hello@testing.com";
  //req.body.id

  router.post('/user', (req, res, next) => {
    id+=1;
    db.query(
      'INSERT INTO user (UserID, password, Fname, Lname, Email) VALUES (?,?,?,?,?)',
      [id, req.body.password, req.body.firstName, req.body.lastName, req.body.email],
      (error) => {
        if (error) {
            console.log(req.body.id);
            console.log(req.body.email);
            console.log(req.body.password);
            console.error(error);
            res.status(500).json({status: 'error'});
        } else {
            console.log(req.body.id);
            res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.get('/hello', (req, res, next) =>{
      console.log("OK");
      const https = require('https')
      var response = "hello";
      const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: '/1.1/trends/place.json?id=1',
        method: 'GET',
        headers: {'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAAP1AJgEAAAAAAnpPXM9AUujBZSQUN40nHGVnaMQ%3DkR1GHff9KRFOUHjxpjpzHH3IiBxwER7T80I5MgpOYnMpDQtzwr'}
      }

      const req2 = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
          //process.stdout.write(d)
          response = JSON.stringify(d);
          console.log(d.toString())
        })
  
      })
    
      req2.on('error', error => {
        console.error(error)
      })
      req2.end();
      //res.send(response);
      res.send(JSON.stringify(response));
      

  });

  router.get('/hello2', (req, res, next) =>{
    console.log("called 2");
    var response = getTrending();
    res.send(JSON.stringify(response));
  });

  function getTrending(){
    const https = require('https')
    const options = {
      hostname: 'api.twitter.com',
      port: 443,
      path: '/1.1/trends/place.json?id=1',
      method: 'GET',
      headers: {'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAAP1AJgEAAAAAAnpPXM9AUujBZSQUN40nHGVnaMQ%3DkR1GHff9KRFOUHjxpjpzHH3IiBxwER7T80I5MgpOYnMpDQtzwr'}
    }

    const req2 = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        //process.stdout.write(d)
        response = JSON.stringify(d);
        console.log(d.toString())
        return d;
      })

    })
  
    req2.on('error', error => {
      console.error(error)
    })
    req2.end();
  

  }

  // the routes are defined here
  return router;
}

module.exports = createRouter;