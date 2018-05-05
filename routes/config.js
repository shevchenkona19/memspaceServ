const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const FileReader = require('filereader');
const base64 = require('js-base64').Base64;

router.get("/categories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM categories');
        res.json({categories: data.rows});
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
});
router.post("/selectedCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    if (!req.body.Ids) {
        return res.status(400).json({message: "incorrect data"});
    }
    const Ids = req.body.Ids;
    try {
        for (var i = 0; i < Ids.length; i++) {
            await db.query('INSERT INTO usersCategories(userId, categoryId) VALUES($1, $2)', [req.user.userid, Ids[0]]);
        }
        res.status(200).json({message: "200"});
    } catch (err) {
        return res.status(500).json({message: "BD error"});
    }
});
router.post("/photo", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    if (!req.body.photo) {
        return res.status(401).json({message: 'incorrect quarry'})
    }
    const photo = base64.atob(req.body.photo);
        await db.query('UPDATE users SET imagedata = $1 WHERE userid = $2', [photo, req.user.userid]);
    return res.status(200).json({message: "200"})
});
router.get("/personalCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        let selCats = await db.query('SELECT categoryid FROM usersCategories WHERE userid = $1', [req.user.userid]);
        let categories = await db.query(`SELECT categoryid, categoryname FROM categories`);

        if (!selCats.rows[0]) {
            return res.status(400).json({message: 'No categories'});
        }
        let toSendArray = [];
        let isUsed = 0;
        categories.rows.forEach((category) => {
            for (var i = 0; i < selCats.rows.length; i++) {
                if(selCats.rows[i].categoryid === category.categoryid){
                    isUsed = 1;
                    break;
                }
            }
           // selCats.rows.forEach((selcategory) => {
             //   
            //});
            toSendArray.push({
                categoryName: category.categoryname,
                categoryIsUsed: isUsed,
                categoryId: category.categoryid
            });
            isUsed = 0;
        });
        return res.status(200).json({categories: toSendArray});
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
});
router.get("/test", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        const categories = await db.query(`SELECT categoryid, categoryname FROM categories`);
        let limit = 1;
        let offset = 0;
        let id = -1;
        let arr = [];
        categories.rows.forEach((category) => {
            do{
                id = -1;
                const data = await db.query(`SELECT imageid FROM imagesCategories WHERE categoryid = $1 `
                    + `ORDER BY imageid DESC LIMIT $2 OFFSET $3`, [category.categoryid, limit, offset]);
                if (data.rows && data.rows[0] && data.rows[0].imageid) {
                    id = data.rows[0].imageid;
                }
                offset++;
            } while (checkPrev(arr, id));
            console.log('id=' + id);
            if (id !== -1) arr.push({imageId: id, categoryName: category.categoryname});
            offset = 0;
        })
        res.status(200).json({test: arr});
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }      
});

checkPrev = (arr, id) => {
    if (id == -1) return false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].imageId === id) return true;
    }
    return false;
};

module.exports = router;