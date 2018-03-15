var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.post("/createCategory", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.body.categoryname && req.user.accesslvl >= 2) {
    var categoryname = req.body.categoryname;
  } else {
    res.status(400).json({ message: "incorrect data" });
    return;
  }
  try {
    await db.query('INSERT INTO categories(categoryname) VALUES($1)', [categoryname])
    await db.query(`ALTER TABLE users ADD "${categoryname}" BIT, ALTER COLUMN ${categoryname} SET DEFAULT '0'`, [])
    await db.query(`UPDATE users SET ${categoryname} = '0'`, [])
    await db.query(`ALTER TABLE images ADD "${categoryname}" BIT, ALTER COLUMN ${categoryname} SET DEFAULT '0'`, [])
    await db.query(`UPDATE images SET ${categoryname} = '0'`, [])
  } catch (err) {
    console.log(err.stack);
  }
  res.status(200).json({ message: "200" });
});
router.get("/getImages", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.offset) {
    var offset = req.query.offset;
  } else return res.status(400).json({ message: "incorrect data" });
  if (req.user.accesslvl >= 2) {
    require('../../vk/api')(offset);
    return res.status(200).json({ message: "200" });
  } else {
    res.status(400).json({ message: "incorrect lvl" });
    return;
  }
});
router.get("/deleteCategory", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.id && req.user.accesslvl >= 2) {
    var id = req.query.id;
  } else {
    res.status(400).json({ message: "incorrect data" });
    return;
  }
  try {
    var data = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [id])
  } catch (err) {
    console.log(err.stack);
  }
  var categoryname = data.rows[0].categoryname;
  try {
    await db.query('DELETE FROM categories WHERE categoryid = $1', [id])
    await db.query(`ALTER TABLE users DROP "${categoryname}"`, [])
    await db.query(`ALTER TABLE images DROP "${categoryname}"`, [])
  } catch (err) {
    console.log(err.stack);
    res.status(200).json({ message: "200" });
  }
});
router.get("/getNewMem", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl >= 1) {
  } else {
    res.status(400).json({ message: "access lvl too low" });
    return;
  }
  try {
    var data = await db.query(`SELECT imageid FROM images WHERE ischecked = '0' ORDER BY imageid LIMIT 1`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (data.rows[0]) {
    res.json(data.rows[0]);
  }
  try {
    await db.query(`UPDATE images SET isChecked = '1' WHERE imageid = ${data.rows[0].imageid}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
});
router.get("/discardMem", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.id && req.user.accesslvl >= 1) {
    var id = req.query.id;
  } else {
    res.status(400).json({ message: "access lvl too low" });
    return;
  }
  try {
    await db.query(`DELETE FROM images WHERE imageid = ${id}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  res.status(200).json({ message: "200" });
});
router.post("/postMem", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.id && req.body.Ids) {
    var id = req.query.id;
    var Ids = req.body.Ids;
  } else {
    res.status(400).json({ message: "incorrect data" });
    return;
  }
  for (var i = 0; i < Ids.length; i++) {
    setCategory(id, Ids[i]);
  }
  res.status(200).json({ message: "200" });
});

var setCategory = async (imageid, categoryid) => {
  try {
    var data = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  var categoryname = data.rows[0].categoryname;
  try {
    await db.query(`UPDATE images SET ${categoryname} = '1' WHERE imageid = ${imageid}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
}

module.exports = router;