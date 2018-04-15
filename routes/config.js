const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

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
        const data = await db.query('SELECT categoryname FROM categories');
        let catsString = '';
        for (let i = 0; i < data.rows.length; i++) {
            catsString = catsString.concat(data.rows[i].categoryname);
            if (i !== data.rows.length - 1) {
                catsString = catsString.concat(" = '0', ");
            } else {
                catsString = catsString.concat(" = '0'")
            }
        }
        await db.query(`UPDATE users SET ${catsString} WHERE userid = ${req.user.userid}`)
        for (let i = 0; i < Ids.length; i++) {
            await setCategory(req.user.userid, Ids[i]);
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
    let bus = new Busboy({headers: req.headers});
    bus.on('file', (fieldname, file, filename, encoding, mimetype) => {
        let saveTo = path.join('.', filename);
        console.log("Upload: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    bus.on('finish', () => {
        res.status(200)
    })
    return req.pipe(bus)
    // TODO: implement busboy multipart http
});
router.get("/personalCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        let data = await db.query('SELECT categoryid, categoryname FROM categories');
        if (!data) {
            return res.status(400).json({message: 'No categories'});
        }
        let catsString = '';
        const ids = [];
        for (let i = 0; i < data.rows.length; i++) {
            catsString = catsString.concat(data.rows[i].categoryname);
            if (i !== data.rows.length - 1) {
                catsString = catsString.concat(', ');
            }
            ids.push(data.rows[i].categoryid);
        }
        data = await db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`);
        const queryResult = data.rows[0];
        const toSendArray = [];
        let j = 0;
        for (let prop in queryResult) {
            toSendArray.push({
                categoryName: prop,
                categoryIsUsed: queryResult[prop],
                categoryId: ids[j]
            });
            j++;
        }
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
        const categories = await getCategoriesArray();
        let count = 1;
        let offset = 0;
        let id = -1;
        const arr = [];
        for (let j = 0; j < categories.length; j++) {
            offset = 0;
            console.log('j=' + j);
            do {
                const data = await db.query(`SELECT imageid FROM images WHERE "${categories[j]}" = '1' ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
                console.log(`SELECT imageid FROM images WHERE "${categories[j]}" = 1 ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
                if (data.rows) {
                    id = data.rows[0].imageid;
                } else {
                    id = -1;
                    break;
                }
                offset++;
            } while (checkPrev(arr, id));
            if (id !== -1) arr.push({imageId: id, categoryName: categories[j]});
        }
        res.status(200).json({test: arr});
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
});

checkPrev = (arr, id) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].imageid === id) return true;
    }
    return false;
};

setCategory = async (userid, categoryid) => {
    try {
        const data = await db.query('SELECT categoryname FROM categories WHERE categoryid = $1', [categoryid])
        const categoryname = data.rows[0].categoryname;
        await db.query(`UPDATE users SET ${categoryname} = '1' WHERE userid = ${userid}`, [])
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
};

getCategoriesArray = async () => {
    try {
        const data = await db.query('SELECT categoryname FROM categories');
        const result = [];
        for (let i = 0; i < data.rows.length; i++) {
            result[i] = data.rows[i].categoryname;
        }
        return result;
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
}
/*  ///try {
        //if(req.file){
      //  console.log(req.file);}
        //let data = await db.query('SELECT * FROM users WHERE userid = $1', [req.user.userid])
        //await db.query('DELETE * FROM users WHERE userid = $1', [req.user.userid])
       // await db.query('INSERT INTO users(username, password, email, imagedata) VALUES($1, $2, $3, $4)', [data.rows[0].username,
         //   data.rows[0].password, data.rows[0].email, req.body])
       // await db.query(`INSERT INTO users SET imagedata = '${req.body}' WHERE userid = ${req.user.userid}`, [])
     //   await db.query(`UPDATE users SET imagedata = '${req.body}' WHERE userid = ${req.user.userid}`, [])
    //} catch (err) {
        //console.log(err.stack);
      //  return res.status(500).json({ message: "BD error" });
    //}*/

module.exports = router;