const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const CharacterSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
})

mongoose.model('character',  CharacterSchema)