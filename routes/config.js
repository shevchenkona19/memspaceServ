var db = require('../model');
var express = require('express');
var router = express.Router();
var passport = require('../app').passport;

router.get("/getCategories", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        var rows = await db.query('SELECT * FROM categories', []);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    if (rows[0]) {
        res.json({ categories: rows });
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
        var rows = await db.query('SELECT categoryname FROM categories', [])
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var catsString = '';
    for (var i = 0; i < rows.length; i++) {
        catsString += rows[i].categoryname;
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
        setCategory(req.user.userid, Ids[i]);
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
        var rows = await db.query('SELECT categoryid, categoryname FROM categories', [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var catsString = '';
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        catsString += rows[i].categoryname;
        catsString += ', ';
        ids.push(rows[i].categoryid);
    }
    catsString = catsString.slice(0, -2);
    try {
        rows = await db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`, [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var ob = rows[0];
    var arr = [];
    var j = 0;
    for (var prop in ob) {
        arr.push({ categoryname: prop, categoryIsUsed: ob[prop], categoryId: ids[j] });
        j++;
    }
    res.json({ categories: arr });
});
router.get("/config/getTest", passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.accesslvl == -1) {
        return res.status(400).json({ message: "unauthorized" });
    }
    try {
        var rows = await db.query('SELECT categoryname FROM categories', [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    if (rows[0]) {
        var categories = [];
        for (var i = 0; i < rows.length; i++) {
            categories.push(rows[i].categoryname);
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
                rows = await db.query(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`, [])
            } catch (err) {
                console.log(err.stack);
                return res.status(500).json({ message: "BD error" });
            }
            console.log(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
            if (rows) {
                id = rows[0].imageid;
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
        var rows = db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var categoryname = rows[0].categoryname;
    console.log(categoryname);
    try {
        await db.query(`UPDATE users SET ${categoryname} = '1' WHERE userid = ${userid}`, [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
}

var getCategoriesArray = async () => {
    try {
        var rows = await db.query('SELECT categoryname FROM categories', [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ message: "BD error" });
    }
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        result[i] = rows[i].categoryname;
    }
    console.log(result);
    return result;
}

module.exports = router;