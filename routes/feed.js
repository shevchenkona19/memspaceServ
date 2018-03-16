var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;
//var fs = require('fs');

router.get("/imgs", async (req, res) => {
  if (req.query.id) {
    var id = req.query.id;
  } else return res.status(400).json({ message: "incorrect query" });
  try {
    var rows = await db.query('SELECT imagedata FROM images WHERE imageId = $1', [id])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    res.contentType('image/jpeg');
    return res.end(rows[0].imagedata, 'binary');
  } else return res.status(400).json({ message: "no image found" });
});
router.get("/getFeed", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.count && req.query.offset) {
    var count = req.query.count;
    var offset = req.query.offset;
  } else return res.status(400).json({ message: "incorrect query" })
  try {
    var rows = await db.query('SELECT images.imageid, images.source, likes, dislikes, likes.opinion AS opinion '
      + 'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 '
      + 'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  return res.json({ memes: rows });
});
router.get("/getCategoriesFeed", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.count && req.query.offset && req.user.accesslvl != -1) {
    var count = req.query.count;
    var offset = req.query.offset;
  } else return res.status(400).json({ message: "incorrect query" })
  try {
    var rows = await db.query('SELECT categoryname FROM categories', [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    return res.status(400).json({ message: "no categories" });
  }
  var catsString = '';
  for (var i = 0; i < rows.length; i++) {
    catsString += `"` + rows[i].categoryname + `"`;
    catsString += ', ';
  }
  catsString = catsString.slice(0, -2);
  try {
    rows = db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (!rows[0]) {
    return res.status(500).json({ message: "BD error" });
  }
  var ob = rows[0];
  var str = '';
  for (var prop in ob) {
    if (ob[prop] == '1') {
      str += `"` + prop + `"` + " = '" + ob[prop] + "'";
      str += ' OR ';
    }
  }
  str = str.substring(0, str.length - 4);
  try {
    rows = await db.query('SELECT images.imageid, images.source, likes, dislikes, likes.opinion AS opinion '
      + `FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE ${str} `
      + 'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    return res.json({ memes: rows });
  } else return res.json({ memes: {} });
});
router.get("/getCategoryFeed", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.count && req.query.offset && req.query.categoryname) {
    var count = req.query.count;
    var offset = req.query.offset;
    var categoryname = req.query.categoryname;
  } else return res.status(400).json({ message: "incorrect query" })
  try {
    var rows = await db.query(`SELECT images.imageid, images.source, likes, dislikes, likes.opinion AS opinion `
      + `FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = ${req.user.userid} WHERE ${categoryname} = '1' `
      + `ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`, [])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    return res.json({ memes: rows });
  } else return res.json({ memes: {} });
});
router.get("/getHotFeed", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.query.count && req.query.offset) {
    var count = req.query.count;
    var offset = req.query.offset;
  } else return res.status(400).json({ message: "incorrect query" })
  var filter = process.env.HOTFILTER;
  try {
    var rows = await db.query('SELECT images.imageid, images.source, likes, dislikes, likes.opinion AS opinion '
      + 'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE likes >= $2 '
      + 'ORDER BY imageid DESC LIMIT $3 OFFSET $4', [req.user.userid, filter, count, offset])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    return res.json({ memes: rows });
  } else return res.json({ memes: {} });
});
router.get("/getUserPhoto", async (req, res) => {
  if (req.query.targetUsername) {
    var targetUsername = req.query.targetUsername;
  } else return res.status(400).json({ message: "incorrect query" })
  try {
    var rows = await db.query('SELECT imagedata FROM users WHERE username = $1', [targetUsername])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (rows[0]) {
    res.contentType('image/jpeg');
    return res.end(rows[0].imagedata, 'binary');
  } else return res.status(400).json({ message: "no image found" });
});

module.exports = router;

// app.get("/feed/saveimage",  function(req, res){  
//   fs.readFile('testPicture.jpg', function(err, data) {
//     if (err) throw err;
//     db.query('INSERT INTO images(imagedata) VALUES($1)', [data], (err, data) => {
//       //res.contentType('image/jpeg');
//       res.json({});     
//     }) 
//   });      
// });