const express = require('express');
const mongoose  = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();


//model
require('../models/User')
const User = mongoose.model('user')

router.get('/login', (req, res) => res.render('users/login'));
router.get('/register', (req, res) => res.render('users/register'));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/characters' ,
        failureRedirect: '/users/login' ,
        failureFlash: true 
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.flash('success_msg', 'You are logged out');
    req.logOut();
    res.redirect('/users/login');
})

router.post('/register', (req, res) => {
    let errors = [];
    if (!req.body.name) errors.push({text:'Please add a name'}) ;
    if (!req.body.email) errors.push({text:'Please add an email'}) ;
    if (req.body.password != req.body.password2) errors.push({text:'Passwords do not match'}) ;
    if (!req.body.password) errors.push({text:'Please add a password'}) ;
    if (req.body.password.length < 4 || req.body.password.length > 21) errors.push({text:'Password must be between 4 an 21 characters'});
    if (errors.length > 0) {
        res.render('users/register', { 
            errors : errors,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            password2 : req.body.password2,
        })
    }else{
        User.findOne({email:req.body.email})
            .then(user => {
                if (user) {
                    errors.push({text:'Email already registered '})
                    res.render('users/register', { 
                        errors : errors,
                        name : req.body.name,
                        email : req.body.email,
                        password : req.body.password,
                        password2 : req.body.password2,
                    })
                }else{
                    const newUser = new User({
                        name : req.body.name,
                        email : req.body.email,
                        password : req.body.password,
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            newUser.save()
                                    .then(user => {
                                        req.flash('success_msg', 'You are registered now and can log in')
                                        res.redirect('/users/login')
                                    })
                                    .catch(err => console.log(err))
                        });
                    });
                }
            })
    }
});

module.exports = router;