var db = require('../../model/db');

module.exports = function(app, passport) {
  app.get("/favorites/addToFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.id){
      var id = req.query.id;
    } else res.status(400).json({ message: "incorrect data" });
    id = ' ' + id;
    db.query('UPDATE users SET favorites = favorites || $1 WHERE userid = $2', [id, req.user.userid], (err, data) => {
      res.status(200).json({ message: "200" });
    }) 
  });
  app.get("/favorites/getAllFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){      
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      res.json(data.rows[0]);
    }) 
  });
  app.get("/favorites/removeFromFavorites",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.query.id){
      var id = req.query.id;
    } else res.status(400).json({ message: "incorrect data" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      var str = data.rows[0].favorites;
      str = str.replace(' ' + id, '');
      db.query('UPDATE users SET favorites = $1 WHERE userid = $2', [str, req.user.userid], (err, data) => {
        res.status(200).json({ message: "200" });
      }) 
    }) 
  });
};