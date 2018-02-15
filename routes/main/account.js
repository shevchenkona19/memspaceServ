var jwt = require('jsonwebtoken');
var db = require('../../model/db');
var fs = require('fs');

module.exports = function(app, passport, jwtOptions) {
    app.post('/account/login', (req, res) => {      
        if(req.body.username && req.body.password){
            var username = req.body.username;
            var password = req.body.password;
          } else return res.status(400).json({ message: "incorrect data" });
          db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, data) => {
            if(data.rows[0]){
              var payload = {id: data.rows[0].userid};
              var token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({token: token});
            } else {
              res.status(401).json({message:"no such user found"});
            }
          })
    });
    app.get("/account/getMyUsername", passport.authenticate('jwt', { session: false }), function(req, res){ 
      if(req.user.accesslvl != -1){
      } else return res.status(400).json({ message: "unauthorized" });
      res.json({"username":req.user.username});     
    });
    app.post('/account/register', (req, res) => {
      if(req.body.username && req.body.password && req.body.email){
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
      } else {
        res.status(400).json({message:"not full info"});
        return;
      }
      db.query('SELECT COUNT(*) as cnt FROM users WHERE username = $1 OR email = $2', [username, email], (err, data) => {
        if(data && data.rows[0].cnt == 0){
            fs.readFile('noimage.png', function(err, image) {
              if (err) throw err;  
              db.query('INSERT INTO users(username, password, email, imagedata) VALUES($1, $2, $3, $4)', [username, password, email, image], (err, data) => {
                db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, data) => {
                  if(data.rows[0]){
                    var payload = {id: data.rows[0].userid};
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.json({token: token});
                  }
                }) 
              })  
            }); 
        } else {
          res.status(400).json({message:"already registered"});
        }
      })
    });
};