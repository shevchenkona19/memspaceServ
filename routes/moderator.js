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
    const categoryName = req.body.categoryName;
    try{
        await db.query('INSERT INTO categories(categoryname) VALUES($1)', [categoryName]);
    } catch(err){
        return res.status(500).json({message: "BD error"});
    }
    res.status(200).json({message: "200"});
});
router.get("/getImages", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.offset) {
        return res.status(400).json({message: "incorrect data"});
    }
    if (!req.user.accesslvl >= 2) {
        return res.status(400).json({message: "incorrect lvl"});
    }
    let offset = req.query.offset;
    
    await require('../vk/api')(offset);
    return res.status(200).json({message: "200"});
});
router.delete("/category", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 2) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    try{
        await db.query('DELETE FROM categories WHERE categoryid = $1', [id]);
        await db.query('DELETE FROM imagesCategories WHERE categoryid = $1', [id]);
        await db.query('DELETE FROM usersCategories WHERE categoryid = $1', [id]);
    } catch(err){
        return res.status(500).json({message: "BD error"});
    }
    res.status(200).json({message: "200"});
});
router.get("/newMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    let mem;
    try{
        mem = await db.query(`SELECT imageid FROM images WHERE ischecked = '0' ORDER BY imageid LIMIT 1`);
    } catch(err){
        return res.status(500).json({message: "BD error"});
    }
    if (mem.rows[0]) {
        res.status(200).json(mem.rows[0]);
    }
    await db.query(`UPDATE images SET isChecked = '1' WHERE imageid = ${mem.rows[0].imageid}`);
});
router.post("/discardMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(400).json({message: 'incorrect quarry'})
    }
    const id = req.query.id;
    try{
        await db.query(`DELETE FROM images WHERE imageid = ${id}`);
    } catch(err){
        return res.status(500).json({message: "BD error"});
    }
    res.status(200).json({message: "200"});
});
router.post("/mem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!(req.query.id && req.body.Ids)) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    const Ids = req.body.Ids;
    for (let i = 0; i < Ids.length; i++) {
        try{
           await setCategory(id, Ids[i]);
        } catch(err) { }
    }
    res.status(200).json({message: "200"});
});

let setCategory = async (imageid, categoryid) => {
    await db.query(`INSERT INTO imagesCategories(imageid, categoryid) VALUES($1, $2)`, [imageid, categoryid]);
}

module.exports = router;