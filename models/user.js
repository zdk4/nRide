'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const bcrypt = require('bcrypt-nodejs')//libreriria para contraseña encriptada
// const crypto = require('crypto')

const UserNride = new Schema({
    _id: Number,
    token: String,
    sessionId:String,
    createDate: Number,//checar estos antes
    Name: String,
    Addres:String,
    State: String,
    Birthdate: String,
    StateLives: Number,//estado donde vive pero su ID
    University: String,
    Phone: String,
    Password: { type: String, select:true},//false contraseña no envie al cliente en false
    ImageProfile: String,
    IDUniveristy: Number,
    CarrerUniversity: String,
    Email: { type: String, unique: true, lowercase:true},
    Constancy: String,//Constrancia de estudios
    Recipt:String,//Recibo de pago
    signupDate: { type: Date, default: Date.now()},//fecha en que se logea
    lastLogin: Date,//fecha de su ultimo sesión
    emailValidate: Boolean,
});

module.exports = mongoose.model('User',UserNride);

