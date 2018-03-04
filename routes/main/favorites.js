var db = require('../../model/db');

module.exports = function(app, passport) {
  app.get("/favorites/addToFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.id && req.user.accesslvl != -1){
      var id = req.query.id;
    } else return res.status(400).json({ message: "incorrect data" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      if(data && data.rows[0]){
        var favarr = json.parse(data.rows[0].favorites); 
        for(var i = 0; i < favarr.length; i++){
          if(favarr[i] == id) return res.status(200).json({ message: "already favorite" });
        }
        // favarr.forEach(element => {
        //   if(element == id) return res.status(200).json({ message: "already favorite" });
        // });
      } else return res.status(200).json({ message:"200" });
      favarr.push(id);
      db.query('UPDATE users SET favories = $1 WHERE userid = $2', [favarr, req.user.userid], (err, data) => {
        res.status(200).json({ message: "200" });
      })
    }) 
  });
  app.get("/favorites/getAllFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){
    if(req.user.accesslvl != -1){
    } else return res.status(400).json({ message: "unauthorized" });      
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      res.json({favorites : data.rows[0] });
    }) 
  });
  app.get("/favorites/removeFromFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.id && req.user.accesslvl != -1){
      var id = req.query.id;
    } else return res.status(400).json({ message: "incorrect data" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      var favarr = data.rows[0].favorites;
      if (favarr.indexOf(id) !== -1) {
        items.splice(items.indexOf(id), 1);
      } else res.status(200).json({ message: "not a favorite" });
      db.query('UPDATE users SET favorites = $1 WHERE userid = $2', [favarr, req.user.userid], (err, data) => {
        res.status(200).json({ message: "200" });
      }) 
    }) 
  });
};