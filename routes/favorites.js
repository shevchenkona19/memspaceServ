var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.get("/addToFavorites", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.id && req.user.accesslvl != -1) {
    var id = req.query.id;
  } else return res.status(401).json({ message: "incorrect data" });
  try {
    var rows = await db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    var favarr = JSON.parse(rows[0].favorites);
    for (var i = 0; i < favarr.length; i++) {
      if (favarr[i] == id) return res.status(200).json({ message: "already favorite" });
    }
  } else return res.status(200).json({ message: "200" });
  favarr.push(id);
  try {
    await db.query(`UPDATE users SET favorites = '${JSON.stringify(favarr)}' WHERE userid = ${req.user.userid}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  res.status(200).json({ message: "200" });
});
router.get("/getAllFavorites", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl != -1) {
  } else return res.status(401).json({ message: "unauthorized" });
  try {
    var rows = db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    res.json({ favorites: JSON.parse(rows[0].favorites) });
  }
  res.status(500).json({ message: "BD error" });
});
router.get("/removeFromFavorites", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.id && req.user.accesslvl != -1) {
    var id = req.query.id;
  } else return res.status(401).json({ message: "incorrect data" });
  try {
    var rows = await db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  var favarr = JSON.parse(rows[0].favorites);
  if (favarr.indexOf(id) !== -1) {
    favarr.splice(favarr.indexOf(id), 1);
  } else res.status(200).json({ message: "not a favorite" });
  try {
    await db.query(`UPDATE users SET favorites = '${JSON.stringify(favarr)}' WHERE userid = ${req.user.userid}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  res.status(200).json({ message: "200" });
});

module.exports = router;