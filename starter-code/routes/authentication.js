const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const multer = require('multer');

const upload = multer({dest: "./public/upload"});

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login', { message: req.flash('error') });
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup', { message: req.flash('error') });
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
    res.render('authentication/profile', {
        user: req.user
    });
});

router.get('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/post', ensureLoggedIn('/login'), (req, res, next) => {
    res.render('post')
})

router.post('/post', ensureLoggedIn('/login'), upload.single('imgPath'), (req, res, next) => {
    let creatorId = req.params.id;
    const  content = req.body.content;
    const imgPath = `/upload/${req.file.filename}`;
    const imgName= req.file.originalname;
    console.log("RSULT::", content, imgName, imgPath, creatorId);
    const newPost = new Post({
        content,
        creatorId,
        imgPath,
        imgName
    });
    newPost
        .save()
        .then(post => res.redirect('/'))
        .catch(err => console.log(err));
})

module.exports = router;