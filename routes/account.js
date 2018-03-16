var jwt = require('jsonwebtoken');
var db = require('../model');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;
<<<<<<< HEAD
=======
var jwtOptions = require('../app').jwtOptions;
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1

router.post('/login', async (req, res) => {
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
  } else return res.status(400).json({ message: "incorrect data" });

  try {
<<<<<<< HEAD
    var rows = await db.query('SELECT userid, password FROM users WHERE username = $1', [username]);
=======
    var data = await db.query('SELECT userid, password FROM users WHERE username = $1', [username]);
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
  }
  catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
<<<<<<< HEAD
  if (rows[0]) {
    if (bcrypt.compareSync(password, rows[0].password)) {
      var payload = { id: rows[0].userid };
=======
  if (data.rows[0]) {
    if (bcrypt.compareSync(password, data.rows[0].password)) {
      var payload = { id: data.rows[0].userid };
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      return res.json({ token: token });
    } else return res.status(401).json({ message: "passwords do not match" });
  } else {
    return res.status(401).json({ message: "no such user found" });
  }
});
router.post('/register', async (req, res) => {
  if (req.body.username && req.body.password && req.body.email) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
  } else return res.status(400).json({ message: "incorrect data" });
  try {
<<<<<<< HEAD
    var rows = await db.query('SELECT COUNT(*) as cnt FROM users WHERE username = $1 OR email = $2', [username, email])
=======
    var data = await db.query('SELECT COUNT(*) as cnt FROM users WHERE username = $1 OR email = $2', [username, email])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
  }
  catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
<<<<<<< HEAD
  if (rows[0] && rows[0].cnt == 0) {
    fs.readFile('noimage.png', function (err, image) {
=======
  if (data.rows[0] && data.rows[0].cnt == 0) {
    fs.readFile('noimage.png', async (err, image) => {
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
      if (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "default image error" });
      }
      var passwordToSave = bcrypt.hashSync(password);
      try {
        await db.query('INSERT INTO users(username, password, email, imagedata) VALUES($1, $2, $3, $4)', [username, passwordToSave, email, image])
<<<<<<< HEAD
      }
      catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      try {
        rows = await db.query('SELECT userid FROM users WHERE username = $1', [username])
      } 
      catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      if (rows[0] && rows[0].userid) {
        var payload = { id: rows[0].userid };
=======
        data = await db.query('SELECT userid FROM users WHERE username = $1', [username])
      } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      if (data.rows[0] && data.rows[0].userid) {
        var payload = { id: data.rows[0].userid };
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.json({ token: token });
      } else {
        return res.status(500).json({ message: "BD error" });
      }
    })
  } else {
  return res.status(400).json({ message: "username or email is already taken" });
  }
})
router.get("/getMyUsername", passport.authenticate('jwt', { session: false }), function (req, res) {
  if (req.user.accesslvl != -1) {
    return res.json({ "username": req.user.username });
  } else {
    return res.status(400).json({ message: "unregistered" });
  }
});
router.get("/test", async (req, res) => {
  console.log('test');
  res.send('tttttttttt');
});

module.exports = router;