var db = require('../../model/db');

module.exports = function (app, passport) {
    app.get("/config/getCategories", passport.authenticate('jwt', {session: false}), function (req, res) {
        db.query('SELECT * FROM categories', [], (err, data) => {
            if (data.rows) {
                res.json({categories: data.rows});
            }
        })
    });
    app.post("/config/postSelectedCategories", passport.authenticate('jwt', {session: false}), function (req, res) {
        if (req.user.accesslvl == -1) {
            return res.status(400).json({message: "unauthorized"});
        }
        if (req.body.Ids) {
            var Ids = req.body.Ids;
        } else return res.status(400).json({message: "incorrect data"});
        db.query('SELECT categoryname FROM categories', [], (err, data) => {
            var catsString = '';
            for (var i = 0; i < data.rows.length; i++) {
                catsString += data.rows[i].categoryname;
                catsString += ` = '0', `;
            }

            catsString = catsString.substring(0, catsString.length - 2);
            db.query(`UPDATE users SET ${catsString} WHERE userid = ${req.user.userid}`, [], (err, data) => {
                for (var i = 0; i < Ids.length; i++) {
                    setCategory(req.user.userid, Ids[i]);
                }
                res.status(200).json({message: "200"});
            })

        })
    });
    app.post("/config/postPhoto", passport.authenticate('jwt', {session: false}), function (req, res) {
        if (req.user.accesslvl == -1) {
            return res.status(400).json({message: "unauthorized"});
        }
        if (req.body.imagedata) {
            var imagedata = req.body.imagedata;
        } else return res.status(400).json({message: "incorrect data"});
        db.query('UPDATE users SET imagedata = $1 WHERE userid = $2', [imagedata, req.user.userid], (err, data) => {
            res.status(200).json({message: "200"});
        })
    });
    app.get("/config/getPersonalCategories", passport.authenticate('jwt', {session: false}), function (req, res) {
        if (req.user.accesslvl == -1) {
            return res.status(400).json({message: "unauthorized"});
        }
        db.query('SELECT categoryid, categoryname FROM categories', [], (err, data) => {
            var catsString = '';
            var ids = [];
            for (var i = 0; i < data.rows.length; i++) {
                catsString += data.rows[i].categoryname;
                catsString += ', ';
                ids.push(data.rows[i].categoryid);
            }
            catsString = catsString.slice(0, -2);
            db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [], (err, data) => {
                var ob = data.rows[0];
                var arr = [];
                var j = 0;
                for (var prop in ob) {
                    arr.push({categoryname: prop, categoryIsUsed: ob[prop], categoryId: ids[j]});
                    j++;
                }
                res.json({categories: arr});
            })
        })
    });
    app.get("/config/getTest", passport.authenticate('jwt', {session: false}), function (req, res) {
        if (req.user.accesslvl == -1) {
            return res.status(400).json({message: "unauthorized"});
        }
        db.query('SELECT categoryname FROM categories', [], (err, data) => {
            if(data){
                var categories = data.rows[0]; 
            } else return res.status(400).json({message: "no categories"});
            
            var arr = [];
            var count = 1; 
            var offset = 0;
            var id;
            for(var i = 0; i < categories.length; i++){
                offset = 0;
                do{
                    db.query('SELECT imageid FROM images WHERE $1 = 1 ORDER BY imageid DESC LIMIT $2 OFFSET $3', [categories[i], count, offset], (err, data) => {
                        if(data && data.rows){
                            id = data.rows[0].imageid;
                        }
                        else id = -1;
                    })
                    if(id == -1) break;
                    offset++;
                } while(checkPrev(arr, id))
                if(id != -1) res.push({ imageid: id, categoryname: categories[i]});
            }
            res.json({test: arr});
        })
    });
};

var checkPrev = (arr, id) => {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].imageid == id) return true;    
    }
}

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
        for (var i = 0; i < data.rows.length; i++) {
            result[i] = data.rows[i].categoryname;
        }
        console.log(result);
        return result;
    })
}