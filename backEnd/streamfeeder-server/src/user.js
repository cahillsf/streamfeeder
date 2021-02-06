const express = require('express');
const bodyParser = require('body-parser');

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

  // the routes are defined here

  return router;
}

module.exports = createRouter;