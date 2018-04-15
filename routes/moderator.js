const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;

router.post("/createCategory", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 2) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.body.categoryName) {
        return res.status(400).json({message: "incorrect query"});
    }
    const categoryName = req.body.categoryname;
    await db.query('INSERT INTO categories(categoryname) VALUES($1)', [categoryName]);
    await db.query(`ALTER TABLE users ADD "${categoryName}" BIT, ALTER COLUMN ${categoryName} SET DEFAULT '0'`);
    await db.query(`UPDATE users SET ${categoryName} = '0'`);
    await db.query(`ALTER TABLE images ADD "${categoryName}" BIT, ALTER COLUMN ${categoryName} SET DEFAULT '0'`);
    await db.query(`UPDATE images SET ${categoryName} = '0'`);
    res.status(200).json({message: "200"});
});
router.get("/getImages", passport.authenticate('jwt', {session: false}), async (req, res) => {
    //что за метод ваще
    if (req.query.offset) {
        let offset = req.query.offset;
    } else return res.status(400).json({message: "incorrect data"});
    if (req.user.accesslvl >= 2) {
        require('../../vk/api')(offset);
        return res.status(200).json({message: "200"});
    } else {
        res.status(400).json({message: "incorrect lvl"});
    }
});
router.delete("/category", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 2) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.body.id) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.body.id;
    const categories = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [id]);
    const categoryName = categories.rows[0].categoryname;
    await db.query('DELETE FROM categories WHERE categoryid = $1', [id]);
    await db.query(`ALTER TABLE users DROP "${categoryName}"`);
    await db.query(`ALTER TABLE images DROP "${categoryName}"`);
    res.status(200).json({message: "200"});
});
router.get("/newMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    const mem = await db.query(`SELECT imageid FROM images WHERE ischecked = '0' ORDER BY imageid LIMIT 1`);
    if (mem.rows[0]) {
        res.status(200).json(mem.rows[0]);
    }
    await db.query(`UPDATE images SET isChecked = '1' WHERE imageid = ${mem.rows[0].imageid}`);
});
router.post("/discardMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.body.id) {
        return res.status(400).json({message: 'incorrect quarry'})
    }
    const id = req.body.id;
    await db.query(`DELETE FROM images WHERE imageid = ${id}`);
    res.status(200).json({message: "200"});
});
router.post("/mem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!(req.body.id && req.body.Ids)) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.body.id;
    const Ids = req.body.Ids;
    for (let i = 0; i < Ids.length; i++) {
        await setCategory(id, Ids[i]);
    }
    res.status(200).json({message: "200"});
});

let setCategory = async (imageid, categoryid) => {
    const categoryName = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
    const category = categoryName.rows[0].categoryname;
    await db.query(`UPDATE images SET ${category} = '1' WHERE imageid = ${imageid}`, [])
}

module.exports = router;