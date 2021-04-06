//import { Observable } from 'rxjs';

const express = require('express');
const bodyParser = require('body-parser');
const Rx = require('rxjs');
const session = require('express-session')
const snoowrap = require('snoowrap');

const {
  getOAuthRequestToken,
  getOAuthAccessTokenWith,
  oauthGetUserById
} = require('./oauth-utilities');
//const { SSL_OP_EPHEMERAL_RSA } = require('constants');

var r = new snoowrap({
  userAgent: 'Streamfeeder by cahillsf9',
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  refreshToken: '257541280611-jb2S8wHiJColc8Pg_qJxUYgZ0-0fSg'
});



function createRouter(db) {
  const router = express.Router();
  var id = Math.floor(Math.random() * 100000);  
  const password = "test";
  const Fname = "testing";
  const Lname = "testing";
  const Email = "hello@testing.com";
  //req.body.id
  var nodeOauthRequestToken;
  var nodeOauthRequestTokenSecret;
  var oauthCheckReqToken;
  let oauthVerifier;
  var oauthAccessToken;
  var redditUserAccessToken;

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

  router.post('/postVerifier', async(req, res, next) => {
    this.oauthVerifier = req.body.verifier;
    console.log("hi posting verifier " + this.oauthVerifier);
    
    //const { oauthRequestToken, oauthRequestTokenSecret } = req.session
    //const { oauth_verifier: oauthVerifier } = req.query
    //console.log('/twitter/callback', { oauthRequestToken, oauthRequestTokenSecret, this.oauthVerifier })
    const oauthRequestToken = this.nodeOauthRequestToken;
    const oauthRequestTokenSecret = this.nodeOauthRequestTokenSecret;
    console.log("nodeOauthRequestToken is " + oauthRequestToken);

    const oauthVerifier = this.oauthVerifier;
    console.log(oauthVerifier);

    const { oauthAccessToken, oauthAccessTokenSecret, results } = await getOAuthAccessTokenWith({ oauthRequestToken, oauthRequestTokenSecret, oauthVerifier })
    this.oauthAccessToken = oauthAccessToken
    console.log("access token is " + this.oauthAccessToken);
    // if (error) {
    //   console.log(req.body.id);
    //   console.log(req.body.email);
    //   console.log(req.body.password);
    //   console.error(error);
    //   res.status(500).json({status: 'error'});
    // } else {
      //console.log(req.body.id);
      res.status(200).json({status: 'ok'});
    // }


    // const { user_id: userId /*, screen_name */ } = results
    // const user = await oauthGetUserById(userId, { oauthAccessToken, oauthAccessTokenSecret })

    // req.session.twitter_screen_name = user.screen_name
    // res.cookie('twitter_screen_name', user.screen_name, { maxAge: 900000, httpOnly: true })

    // console.log('user succesfully logged in with twitter', user.screen_name)

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

  router.get('/authTest', (req, res, next) =>{
      console.log("OK here");
      console.log(process.env.API_KEY)
      const https = require('https')
      let callBack = encodeURI("https://localhost:8100/");
      const options = {
        hostname: 'api.twitter.com',
        port: 443,
        path: '/oauth/request_token',
        method: 'POST',
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
  router.get('/authorizeThis', (req, res, next) =>{
    console.log(process.env.TWITTER_CONSUMER_API_KEY);
    console.log(process.env.TWITTER_CONSUMER_API_SECRET_KEY);
    console.log("called authorizeThis");
    twitter('authorize')(req, res);
    
  });

  router.get('/accessToken', (req, res, next)=>{
    res.send(JSON.stringify({accessToken: this.oauthAccessToken}));
  }
  )



  function twitter (method = 'authorize') {
    return async (req, res) => {
      console.log(`/twitter/${method}`)
      const { oauthRequestToken, oauthRequestTokenSecret } = await getOAuthRequestToken()
      console.log(`/twitter/${method} ->`, { oauthRequestToken, oauthRequestTokenSecret })

      //req.session.oauthRequestToken = oauthRequestToken
      //req.session.oauthRequestTokenSecret = oauthRequestTokenSecret
      this.nodeOauthRequestToken = oauthRequestToken;
      this.nodeOauthRequestTokenSecret = oauthRequestTokenSecret;

      const authorizationUrl = `https://api.twitter.com/oauth/${method}?oauth_token=${oauthRequestToken}`
      var strResponse = authorizationUrl;
      console.log('redirecting user to ', authorizationUrl)
      //res.statusCode = 301
      //res.setHeader('Location', authorizationUrl)
      res.send(JSON.stringify({data: strResponse}));
      //res.end()
    }
  }

 
  router.get('/moreData', (req, res, next)=>{
    this.redditUserAccessToken = req.query.accessToken;
    getMorePlease()(req, res);
  })

  function getMorePlease(){
    return async(req, res) =>{
      console.log("mmmoooorrreee 287");
      const data = await getMoreCall();
      //res.send(JSON.stringify({hello: "ARE YOU ENTERTAINED"}));
      res.send({data: data});
    }

  }

  async function getMoreCall(){
    var redditAccess = this.redditUserAccessToken;
    return new Promise(function (resolve, reject) {
      const https = require('https')
      let resString;
      const options = {
        hostname: 'oauth.reddit.com',
        path: '/new',
        method: 'GET',
        headers: {'Authorization':'Bearer ' + redditAccess, 'User-Agent':'Streamfeeder by cahillsf9'}
      }
      var req = https.request(options, function(res) {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error('statusCode=' + res.statusCode));
        }
        var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
        });
        res.on('end', function() {
          try {
              body = JSON.parse(Buffer.concat(body).toString());
          } catch(e) {
              reject(e);
          }
          resolve(body);
      });
    });
    req.on('error', function(err) {
        // This is not a "Second reject", just a different sort of failure
        reject(err);
    });
    // if (postData) {
    //     req.write(postData);
    // }
    req.end();
    }
    )
  }

  router.post('/postNewComment', (req, res, next) =>{
    console.log(req.body.postName);
    console.log(req.body.message);
    let postName = req.body.postName;
    let message = req.body.message;
    this.r.getSubmission(postName).reply(message);

  });

  router.post('/userAuth', (req, res, next) => {
    console.log("LINE 324 HERE");
    console.log("line 320 " + req.body.auth);
    this.r = new snoowrap({
          userAgent: 'Streamfeeder by cahillsf9',
          clientId: process.env.clientId,
          clientSecret: process.env.clientSecret,
          refreshToken: req.body.auth
    });
    res.status(200).json({status: 'ok'}); 
  });

  router.get('/getComments', (req, res, next) =>{

    //WORKING GET COMMENTS FUNCTION
    //takes the ['id'] of the post (not the name --- without (t3_))
    options={
      limit: 25,
      depth: 1
    };
   

    var myComments = r.getSubmission('mivbou').expandReplies({limit: Infinity, depth: Infinity}).then(result => {
      var myData = result;
      console.log(myData);
    }
    )
    
  });

  
  // the routes are defined here
  return router;
}

module.exports = createRouter;