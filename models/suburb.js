'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const suburb = new Schema({
    Suburb: String,
    City: String,
    State: String,
    CP: Number
})

module.exports = mongoose.model('Suburb', suburb);