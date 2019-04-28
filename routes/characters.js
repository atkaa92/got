const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

//model
require('../models/Character')
const Character = mongoose.model('character')

router.get('/', ensureAuthenticated,  (req, res) => {
    Character.find({user: req.user._id})
            .sort({date:'desc'})
            .then(characters => res.render('characters/index', { characters }))
});

router.get('/add', ensureAuthenticated,  (req, res) => res.render('characters/add'));

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.name) errors.push({text:'Please add a name'}) ;
    if (!req.body.about) errors.push({text:'Please add a some details'});
    if (errors.length > 0) {
        res.render('characters/add', { 
            errors : errors,
            name : req.body.name,
            about : req.body.about,
        })
    }else{
        const newCharacter = {
            name : req.body.name,
            about : req.body.about,
            user : req.user._id,
        }
        new Character(newCharacter)
            .save()
            .then(character => { 
                req.flash('success_msg', 'GOT character added')
                res.redirect('/characters')
            })
    }
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Character.findOne({ _id:req.params.id})
            .then(character => {
                if (character.user != req.user._id) {
                    req.flash('error_msg', 'Not authenticated')
                    res.redirect('/characters')
                } else {
                    res.render('characters/edit', { character })
                }
            }) 
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Character.findOne({ _id:req.params.id})
        .then(character => {
            character.name = req.body.name;
            character.about = req.body.about;
            character.save()
                .then(character => { 
                    req.flash('success_msg', 'GOT character updeted')
                    res.redirect('/characters')
                })
        })
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Character.remove({ _id:req.params.id, user:req.user._id})
        .then(() => { 
            req.flash('success_msg', 'GOT character removed')
            res.redirect('/characters')
        })
});

module.exports = router;
