var db = require('../../model/db');

module.exports = function(app, passport) {
  app.get("/config/getCategories",  passport.authenticate('jwt', { session: false }), function(req, res){      
    db.query('SELECT * FROM categories', [], (err, data) => {
      if(data.rows){
        res.json({ categories: data.rows });
      }
    }) 
  });
  app.post("/config/postSelectedCategories",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.body.Ids){
      var Ids = req.body.Ids;
    } else return res.status(400).json({ message: "incorrect data" });

    for(var i = 0; i < Ids.length; i++){
      setCategory(req.user.userid, Ids[i]);
    }
    res.status(200).json({ message: "200" });
  });
  app.post("/config/postPhoto",  passport.authenticate('jwt', { session: false }), function(req, res){      
    if(req.body.imagedata){
      var imagedata = req.body.imagedata;
    } else return res.status(400).json({ message: "incorrect data" });
    db.query('UPDATE users SET imagedata = $1 WHERE userid = $2', [imagedata, req.user.userid], (err, data) => {
      res.status(200).json({ message: "200" });
    })
  });
  app.get("/config/getPersonalCategories",  passport.authenticate('jwt', { session: false }), function(req, res){
    db.query('SELECT categoryname FROM categories', [], (err, data) => {
      var catsString = '';
      for(var i = 0; i < data.rows.length; i++){
        catsString += data.rows[i].categoryname;
        catsString += ', ';
      }
      catsString = catsString.slice(0, -2);
      db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [], (err, data) => {
        var ob = data.rows[0];
        var arr = [];
        for(var prop in ob){
          arr.push('"' + prop + '":"' + ob[prop] + '"'); 
        }
        res.json({ categories:arr });
      })
    })
  });
};

var setCategory = (userid, categoryid) => {
  db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid], (err, data) => {
    var categoryname = data.rows[0].categoryname;
    console.log(categoryname);
    db.query(`UPDATE users SET ${categoryname} = '1' WHERE userid = ${userid}`, [], (err, data) => {
    })
  })
}

var getCategoriesArray = () => {
  db.query('SELECT categoryname FROM categories', [], (err, data) => {
    var result = [];
    for(var i = 0; i < data.rows.length; i++){
      result[i] = data.rows[i].categoryname;
    }
    console.log(result);
    return result;
  })
}