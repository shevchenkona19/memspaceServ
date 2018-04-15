const jwt = require('jsonwebtoken');
const db = require('../model');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const jwtOptions = require('../app').jwtOptions;

router.post('/login', async (req, res) => {
    console.warn(req.body);
    const body = req.body;
    if (!(body.username && body.password)) {
        return res.status(400).json({message: 'incorrect data'})
    }
    const username = body.username;
    const password = body.password;
    try {
        const data = await db.query('SELECT userid, password FROM users WHERE username = $1', [username]);
        if (data.rows[0]) {
            bcrypt.compare(password, data.rows[0].password, (err) => {
                if (err) {
                    return res.status(401).json({message: "passwords do not match"});
                }
                const payload = {id: data.rows[0].userid};
                const token = jwt.sign(payload, jwtOptions.secretOrKey);
                return res.json({token: token});
            })
        } else {
            return res.status(401).json({message: "no such user found"});
        }
    } catch (err) {
        console.log(err.stack); 
        return res.status(500).json({message: "BD error"});
    }
});
router.post('/register', async (req, res) => {
    const body = req.body;
    if (!(body.username && body.password && body.email)) {
        return res.status(400).json({message: "incorrect data"});
    }
    const username = body.username;
    const password = body.password;
    const email = body.email;
    try {
        data = await db.query('SELECT COUNT(*) as cnt FROM users WHERE username = $1 OR email = $2', [username, email])
        if (!(data.rows[0] && data.rows[0].cnt === 0)) {
            return res.status(400).json({message: "username or email is already taken"});
        }
        fs.readFile('noimage.png', async (err, image) => {
            if (err) {
                console.log(err.stack);
                return res.status(500).json({message: "default image error"});
            }
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({message: 'failed to create password'})
                }
                await db.query('INSERT INTO users(username, password, email, imagedata) VALUES($1, $2, $3, $4)', [username, passwordToSave, email, image])
                data = await db.query('SELECT userid FROM users WHERE username = $1', [username])
                if (!(data.rows[0] && data.rows[0].userid)) {
                    return res.status(500).json({message: "BD error"});
                }
                const payload = {id: data.rows[0].userid};
                const token = jwt.sign(payload, jwtOptions.secretOrKey);
                return res.json({token: token});
            });
        })
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
});
router.get("/myUsername", passport.authenticate('jwt', {session: false}), (req, res) => {
    if (req.user.accesslvl !== -1) {
        return res.status(200).json({"username": req.user.username});
    }
    return res.status(400).json({message: "unregistered"});
})
router.get("/test", async (req, res) => {
    console.log('test');
    res.send('tttttttttt');
});

module.exports = router;