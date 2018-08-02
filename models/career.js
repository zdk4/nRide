'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const careerUniversity = new Schema({
    id_career: {type: Number, unique: true},
    career: String,
    center: String,
    id_university: Number,
    university: String

});

module.exports = mongoose.model('Careers', careerUniversity)