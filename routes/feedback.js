var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.get("/postLike", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id) {
    var imageId = req.query.id;
    var userId = req.user.userid;
  } else return res.status(400).json({ message: "incorrect query" });
  try {
    var data = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (data.rows[0]) {
    if (data.rows[0].opinion == 0) {
      await delDislike(userId, imageId);
      await setLike(userId, imageId);
    }
  } else {
    await setLike(userId, imageId);
  }
  res.status(200).json({ message: "200" });
});
router.get("/postDislike", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id) {
    var imageId = req.query.id;
    var userId = req.user.userid;
  } else return res.status(400).json({ message: "incorrect query" });
  try {
    var data = db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  console.log(data.rows[0]);
  if (data.rows[0]) {
    if (data.rows[0].opinion == 1) {
      await delLike(userId, imageId);
      await setDislike(userId, imageId);
    }
  } else {
    await setDislike(userId, imageId);
  }
  res.status(200).json({ message: "200" });
});
router.get("/deleteLike", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id) {
    var imageId = req.query.id;
    var userId = req.user.userid;
  } else return res.status(400).json({ message: "incorrect query" });
  try {
    var data = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (data.rows[0]) {
    if (data.rows[0].opinion == 1) {
      await delLike(userId, imageId);
      return res.status(200).json({ message: "200" });
    }
  }
  return res.status(200).json({ message: "200" });
});
router.get("/deleteDislike", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id) {
    var imageId = req.query.id;
    var userId = req.user.userid;
  } else return res.status(400).json({ message: "incorrect query" });
  try {
    var data = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  if (data.rows[0]) {
    if (data.rows[0].opinion == 0) {
      await delDislike(userId, imageId);
      return res.status(200).json({ message: "200" });
    }
  }
  return res.status(200).json({ message: "200" });
});
router.post("/postComment", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id && req.body.text) {
    var imageId = req.query.id;
    var userId = req.user.userid;
    var text = req.body.text;
    var date = new Date().toLocaleString();
  } else return res.status(400).json({ message: "incorrect data" });
  try {
    var data = await db.query('INSERT INTO comments(userId, imageId, text, date) VALUES($1, $2, $3, $4)', [userId, imageId, text, date])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  return res.status(200).json({ message: "200" });
});
router.get("/getComments", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.accesslvl == -1) {
    return res.status(401).json({ message: "unauthorized" });
  }
  if (req.query.id && req.query.count && req.query.offset) {
    var imageid = req.query.id;
    var count = req.query.count;
    var offset = req.query.offset;
  } else return res.status(400).json({ message: "incorrect query" })
  try {
    var data = await db.query('SELECT username, text, date FROM comments INNER JOIN users ON comments.userId = users.userId WHERE imageId = $1 LIMIT $2 OFFSET $3', [imageid, count, offset])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
  res.json({ "comments": data.rows });
});

var setLike = async (userId, imageId) => {
  try {
    await db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 1])
    await db.query('UPDATE images SET likes = likes+1 WHERE imageId = $1', [imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
}
var delLike = async (userId, imageId) => {
  try {
    await db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
    await db.query('UPDATE images SET likes = likes-1 WHERE imageId = $1', [imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
}
var setDislike = async (userId, imageId) => {
  try {
    await db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 0])
    await db.query('UPDATE images SET dislikes = dislikes+1 WHERE imageId = $1', [imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
}
var delDislike = async (userId, imageId) => {
  try {
    await db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
    await db.query('UPDATE images SET dislikes = dislikes-1 WHERE imageId = $1', [imageId])
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ message: "BD error" });
  }
}

module.exports = router;