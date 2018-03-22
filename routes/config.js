var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.get("/getCategories", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
<<<<<<< HEAD
        var rows = await db.query('SELECT * FROM categories', []);
=======
        var data = await db.query('SELECT * FROM categories', []);
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
<<<<<<< HEAD
    if (rows[0]) {
        res.json({ categories: rows });
=======
    if (data.rows[0]) {
        res.json({ categories: data.rows });
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    }
});
router.post("/postSelectedCategories", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.accesslvl == -1) {
        return res.status(400).json({ message: "unauthorized" });
    }
    if (req.body.Ids) {
        var Ids = req.body.Ids;
    } else return res.status(400).json({ message: "incorrect data" });
    try {
<<<<<<< HEAD
        var rows = await db.query('SELECT categoryname FROM categories', [])
=======
        var data = await db.query('SELECT categoryname FROM categories', [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var catsString = '';
<<<<<<< HEAD
    for (var i = 0; i < rows.length; i++) {
        catsString += rows[i].categoryname;
=======
    for (var i = 0; i < data.rows.length; i++) {
        catsString += data.rows[i].categoryname;
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
        catsString += ` = '0', `;
    }

    catsString = catsString.substring(0, catsString.length - 2);
    try {
        await db.query(`UPDATE users SET ${catsString} WHERE userid = ${req.user.userid}`, [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    for (var i = 0; i < Ids.length; i++) {
        await setCategory(req.user.userid, Ids[i]);
    }
    res.status(200).json({ message: "200" });
});
router.post("/postPhoto", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.accesslvl == -1) {
        return res.status(400).json({ message: "unauthorized" });
    }
    if (req.body.imagedata) {
        var imagedata = req.body.imagedata;
    } else return res.status(400).json({ message: "incorrect data" });
    try {
        await db.query('UPDATE users SET imagedata = $1 WHERE userid = $2', [imagedata, req.user.userid])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    res.status(200).json({ message: "200" });
});
router.get("/getPersonalCategories", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.accesslvl == -1) {
        return res.status(400).json({ message: "unauthorized" });
    }
    try {
<<<<<<< HEAD
        var rows = await db.query('SELECT categoryid, categoryname FROM categories', [])
=======
        var data = await db.query('SELECT categoryid, categoryname FROM categories', [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var catsString = '';
    var ids = [];
<<<<<<< HEAD
    for (var i = 0; i < rows.length; i++) {
        catsString += rows[i].categoryname;
        catsString += ', ';
        ids.push(rows[i].categoryid);
    }
    catsString = catsString.slice(0, -2);
    try {
        rows = await db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [])
=======
    for (var i = 0; i < data.rows.length; i++) {
        catsString += data.rows[i].categoryname;
        catsString += ', ';
        ids.push(data.rows[i].categoryid);
    }
    catsString = catsString.slice(0, -2);
    try {
        data = await db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
<<<<<<< HEAD
    var ob = rows[0];
=======
    var ob = data.rows[0];
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    var arr = [];
    var j = 0;
    for (var prop in ob) {
        arr.push({ categoryname: prop, categoryIsUsed: ob[prop], categoryId: ids[j] });
        j++;
    }
    res.json({ categories: arr });
});
router.get("/getTest", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.accesslvl == -1) {
        return res.status(400).json({ message: "unauthorized" });
    }
    try {
<<<<<<< HEAD
        var rows = await db.query('SELECT categoryname FROM categories', [])
=======
        var data = await db.query('SELECT categoryname FROM categories', [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
<<<<<<< HEAD
    if (rows[0]) {
        var categories = [];
        for (var i = 0; i < rows.length; i++) {
            categories.push(rows[i].categoryname);
=======
    if (data.rows[0]) {
        var categories = [];
        for (var i = 0; i < data.rows.length; i++) {
            categories.push(data.rows[i].categoryname);
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
        }
    } else return res.status(400).json({ message: "no categories" });

    var arr = [];
    var count = 1;
    var offset = 0;
    var id;
    for (var j = 0; j < categories.length; j++) {
        offset = 0;
        console.log('j=' + j);
        do {
            try {
<<<<<<< HEAD
                rows = await db.query(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`, [])
=======
                data = await db.query(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`, [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
            } catch (err) {
                console.log(err.stack);
                return res.status(500).json({ message: "BD error" });
            }
            console.log(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
<<<<<<< HEAD
            if (rows) {
                id = rows[0].imageid;
=======
            if (data.rows) {
                id = data.rows[0].imageid;
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
                console.log(id);
            }
            else id = -1;
            if (id == -1) break;
            offset++;
        } while (checkPrev(arr, id))
        if (id != -1) arr.push({ imageid: id, categoryname: categories[j] });
    }
    res.json({ test: arr });
});

var checkPrev = (arr, id) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].imageid == id) return true;
    }
    return false;
}

var setCategory = async (userid, categoryid) => {
    try {
<<<<<<< HEAD
        var rows = db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
=======
        var data = db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
<<<<<<< HEAD
    var categoryname = rows[0].categoryname;
=======
    var categoryname = data.rows[0].categoryname;
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    console.log(categoryname);
    try {
        await db.query(`UPDATE users SET ${categoryname} = '1' WHERE userid = ${userid}`, [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
}
/*
var getCategoriesArray = async () => {
    try {
<<<<<<< HEAD
        var rows = await db.query('SELECT categoryname FROM categories', [])
=======
        var data = await db.query('SELECT categoryname FROM categories', [])
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var result = [];
<<<<<<< HEAD
    for (var i = 0; i < rows.length; i++) {
        result[i] = rows[i].categoryname;
=======
    for (var i = 0; i < data.rows.length; i++) {
        result[i] = data.rows[i].categoryname;
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
    }
    console.log(result);
    return result;
}*/

module.exports = router;