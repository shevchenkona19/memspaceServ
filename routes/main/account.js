var jwt = require('jsonwebtoken');
var db = require('../../model/db');
var fs = require('fs');
var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);
console.log(salt);

module.exports = function(app, passport, jwtOptions) {
    app.post('/account/login', (req, res) => {      
        if(req.body.username && req.body.password){
            var username = req.body.username;
            var password = req.body.password;
          } else return res.status(400).json({ message: "incorrect data" });
          db.query('SELECT userid, password FROM users WHERE username = $1', [username], (err, data) => {
            if(data.rows[0]){
              if (bcrypt.hashSync(password, salt) === data.rows[0].password) {
                var payload = {id: data.rows[0].userid};
                var token = jwt.sign(payload, jwtOptions.secretOrKey);
                return res.json({token: token});
              }      
              
              
            } else {
              return res.status(401).json({message:"no such user found"});
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
        return res.status(400).json({message:"not full info"});
      }
      db.query('SELECT COUNT(*) as cnt FROM users WHERE username = $1 OR email = $2', [username, email], (err, data) => {
        if(data && data.rows[0].cnt == 0){
            fs.readFile('noimage.png', function(err, image) {
              if (err) throw err;
              console.log(password);
              var passwordToSave = bcrypt.hashSync(password, salt);
              console.log(passwordToSave);
              db.query('INSERT INTO users(username, password, email, imagedata) VALUES($1, $2, $3, $4)', [username, passwordToSave, email, image], (err, data) => {
                db.query('SELECT userid FROM users WHERE username = $1', [username], (err, data) => {
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