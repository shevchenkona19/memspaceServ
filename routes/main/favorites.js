var db = require('../../model/db');

module.exports = function (app, passport) {
  app.get("/favorites/addToFavorites", passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.query.id && req.user.accesslvl != -1) {
      var id = req.query.id;
    } else return res.status(401).json({ message: "incorrect data" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      if (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      if (data && data.rows[0]) {
        var favarr = JSON.parse(data.rows[0].favorites);
        for (var i = 0; i < favarr.length; i++) {
          if (favarr[i] == id) return res.status(200).json({ message: "already favorite" });
        }
        // favarr.forEach(element => {
        //   if(element == id) return res.status(200).json({ message: "already favorite" });
        // });
      } else return res.status(200).json({ message: "200" });
      favarr.push(id);
      db.query(`UPDATE users SET favorites = '${JSON.stringify(favarr)}' WHERE userid = ${req.user.userid}`, [], (err, data) => {
        if (err) {
          console.log(err.stack);
          return res.status(500).json({ message: "BD error" });
        }
        res.status(200).json({ message: "200" });
      })
    })
  });
  app.get("/favorites/getAllFavorites", passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.user.accesslvl != -1) {
    } else return res.status(401).json({ message: "unauthorized" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      if (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      if (data.rows[0]) {
        res.json({ favorites: JSON.parse(data.rows[0].favorites) });
      }
      res.status(500).json({ message: "BD error" });
    })
  });
  app.get("/favorites/removeFromFavorites", passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.query.id && req.user.accesslvl != -1) {
      var id = req.query.id;
    } else return res.status(401).json({ message: "incorrect data" });
    db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid], (err, data) => {
      if (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
      }
      var favarr = JSON.parse(data.rows[0].favorites);
      if (favarr.indexOf(id) !== -1) {
        favarr.splice(favarr.indexOf(id), 1);
      } else res.status(200).json({ message: "not a favorite" });
      db.query(`UPDATE users SET favorites = '${JSON.stringify(favarr)}' WHERE userid = ${req.user.userid}`, [], (err, data) => {
        if (err) {
          console.log(err.stack);
          return res.status(500).json({ message: "BD error" });
        }
        res.status(200).json({ message: "200" });
      })
    })
  });
};