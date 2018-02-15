var db = require('../../model/db');

module.exports = function(app, passport) {
  app.get("/feedback/postLike",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id){
      var imageId = req.query.id;
      var userId = req.user.userid;
    } else return res.status(400).json({ message: "incorrect query" });

    db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
      if(data.rows[0]){
        if(data.rows[0].opinion == 0){
          delDislike(userId, imageId);
          setLike(userId, imageId);
        }
      } else{
        setLike(userId, imageId);
      }    
      res.status(200).json({ message: "200" });
    }) 
  });
  app.get("/feedback/postDislike",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id){
      var imageId = req.query.id;
      var userId = req.user.userid;
    } else return res.status(400).json({ message: "incorrect query" });

    db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
      if(data.rows[0]){
        if(data.rows[0].opinion == 1){
          delLike(userId, imageId);
          setDislike(userId, imageId);
        }
      } else{
        setDislike(userId, imageId);
      }    
      res.status(200).json({ message: "200" });
    }) 
  });
  app.get("/feedback/deleteLike",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id){
      var imageId = req.query.id;
      var userId = req.user.userid;
    } else return res.status(400).json({ message: "incorrect query" });

    db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
      if(data.rows[0]){
        if(data.rows[0].opinion == 1){
          delLike(userId, imageId);
          return res.status(200).json({ message: "200" });
        }
      }
      return res.status(400).json({ message: "cannot delete like" });
    }) 
  });
  app.get("/feedback/deleteDislike",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id){
      var imageId = req.query.id;
      var userId = req.user.userid;
    } else return res.status(400).json({ message: "incorrect query" });

    db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
      if(data.rows[0]){
        if(data.rows[0].opinion == 0){
          delDislike(userId, imageId);
          return res.status(200).json({ message: "200" });
        }
      }
      return res.status(400).json({ message: "cannot delete dislike" });
    }) 
  });
  app.post("/feedback/postComment",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id && req.body.text){
      var imageId = req.query.id;
      var userId = req.user.userid;
      var text = req.body.text;
      var date = new Date().toLocaleString();
    } else return res.status(400).json({ message: "incorrect data" });

    db.query('INSERT INTO comments(userId, imageId, text, date) VALUES($1, $2, $3, $4)', [userId, imageId, text, date], (err, data) => {
      res.status(200).json({ message: "200" });
    }) 
  });
  app.get("/feedback/getComments",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.user.accesslvl == -1){
      return res.status(400).json({ message: "unauthorized" });
    }
    if(req.query.id && req.query.count && req.query.offset){
      var imageid = req.query.id;
      var count = req.query.count;
      var offset = req.query.offset;
    } else return res.status(400).json({message: "incorrect query"})

    db.query('SELECT username, text, date FROM comments INNER JOIN users ON comments.userId = users.userId WHERE imageId = $1 LIMIT $2 OFFSET $3', [imageid, count, offset], (err, data) => {
      res.json( { "comments" : data.rows });   
    }) 
  });
};

var setLike = (userId, imageId) => {
  db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 1], (err, data) => {
    db.query('UPDATE images SET likes = likes+1 WHERE imageId = $1', [imageId], (err, data) => {
    })
  })
}
var delLike = (userId, imageId) => {
  db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
    db.query('UPDATE images SET likes = likes-1 WHERE imageId = $1', [imageId], (err, data) => {
    })
  })
}
var setDislike = (userId, imageId) => {
  db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 0], (err, data) => {
    db.query('UPDATE images SET dislikes = dislikes+1 WHERE imageId = $1', [imageId], (err, data) => {
    })
  })
}
var delDislike = (userId, imageId) => {
  db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId], (err, data) => {
    db.query('UPDATE images SET dislikes = dislikes-1 WHERE imageId = $1', [imageId], (err, data) => {
    })
  })
}