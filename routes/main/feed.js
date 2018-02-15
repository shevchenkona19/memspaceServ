var db = require('../../model/db');
//var fs = require('fs');

module.exports = function(app, passport) {
  app.get("/feed/imgs", function(req, res){      
    if(req.query.id){
      var id = req.query.id;
    } 
    db.query('SELECT imagedata FROM images WHERE imageId = $1', [id], (err, data) => {
      res.contentType('image/jpeg');
      res.end(data.rows[0].imagedata, 'binary');     
    }) 
  });
  app.get("/feed/getFeed",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.count && req.query.offset){
      var count = req.query.count;
      var offset = req.query.offset;
    } else return res.status(400).json({message: "incorrect query"})
        db.query('SELECT images.imageid, likes, dislikes, likes.opinion AS opinion '
            +'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 ' 
            +'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset], (err, data) => {
          res.json({ memes: data.rows });   
        })  
  });
  // app.get("/feed/getCategoriesFeed",  passport.authenticate('jwt', { session: false }), function(req, res){      
  //   if(req.query.count && req.query.offset && req.user.accesslvl != -1){
  //     var count = req.query.count;
  //     var offset = req.query.offset;
  //   } else return res.status(400).json({message: "incorrect query"})
  //   db.query('SELECT categoryname FROM categories', [], (err, data) => {
  //     var catsString = '';
  //     for(var i = 0; i < data.rows.length; i++){
  //       catsString += data.rows[i].categoryname;
  //       catsString += ', ';
  //     }
  //     catsString = catsString.slice(0, -2);
  //     db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [], (err, data) => {
  //       var ob = data.rows[0];
  //       var str = '';
  //       for(var prop in ob){
  //         if(ob[prop] == '1'){
  //           str += prop + ' = ' + ob[prop] ; 
  //         }
  //         str += ' AND ';
  //       }
  //       str = str.substring(0, str.length - 5);
  //       db.query('SELECT images.imageid, likes, dislikes, likes.opinion AS opinion '
  //           +`FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE ${str}` 
  //           +'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset], (err, data) => {
  //         res.json({ memes: data.rows });   
  //       }) 
  //     })
  //   })
  // });
  app.get("/feed/getCategoryFeed",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.count && req.query.offset && req.query.categoryname){
      var count = req.query.count;
      var offset = req.query.offset;
      var categoryname = req.query.categoryname;
    } else return res.status(400).json({message: "incorrect query"})
    db.query(`SELECT images.imageid, likes, dislikes, likes.opinion AS opinion `
            +`FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = ${req.user.userid} WHERE ${categoryname} = '1' ` 
            +`ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`, [], (err, data) => {
      res.json({ memes: data.rows });   
    }) 
  });
  app.get("/feed/getUserPhoto",  function(req, res){      
    if(req.query.targetUsername){
      var targetUsername = req.query.targetUsername;
    } else return res.status(400).json({message: "incorrect query"})
    db.query('SELECT imagedata FROM users WHERE username = $1', [targetUsername], (err, data) => {
      res.contentType('image/jpeg');
      res.end(data.rows[0].imagedata, 'binary');  
    }) 
  });
  app.get("/feed/getHotFeed",  passport.authenticate('jwt', { session: false }), function(req, res){      
    var filter = 1;
    if(req.query.count && req.query.offset){
      var count = req.query.count;
      var offset = req.query.offset;
    } else return res.status(400).json({message: "incorrect query"})
    db.query('SELECT images.imageid, likes, dislikes, likes.opinion AS opinion '
            +'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE likes >= $2' 
            +'ORDER BY imageid DESC LIMIT $3 OFFSET $4', [req.user.userid, filter, count, offset], (err, data) => {
      res.json({ memes: data.rows });   
    }) 
  });
  app.get("/feed/test",  function(req, res){  
    res.json({});     
  });
};

// app.get("/feed/saveimage",  function(req, res){  
//   fs.readFile('testPicture.jpg', function(err, data) {
//     if (err) throw err;
//     db.query('INSERT INTO images(imagedata) VALUES($1)', [data], (err, data) => {
//       //res.contentType('image/jpeg');
//       res.json({});     
//     }) 
//   });      
// });