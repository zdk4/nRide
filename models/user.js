'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserNride = new Schema({
    _id: Number,
    token: String,
    sessionId:String,
    createDate: Number,//checar estos antes
    Name: String,
    Addres:String,
    State: Number,// usuario 1,rider 2    // cambiarle nombre de state por otro
    Birthdate: String,
    StateLives: String,
    _idStateLives: Number,//estado donde vive pero su ID
    University: String,
    _idUniversity: String,
    Phone: String,
    Password: { type: String, select:true},//false contraseña no envie al cliente en false
    ImageProfile: String,
    IDUniveristy: Number,
    CarrerUniversity: String,
    _idCarrerUniversity: Number,// id de la carrera
    Email: { type: String, unique: true, lowercase:true},
    Constancy: String,//Constrancia de estudios
    Recipt:String,//Recibo de pago
    signupDate: { type: Date, default: Date.now()},//fecha en que se logea
    lastLogin: Date,//fecha de su ultimo sesión
    emailValidate: Boolean,
});

const UserCar = new Schema({
    _idOwner: Number,//id del usuario que es del carro
    _idCar: Number,
    brandsCar: String,//Marca de carro
    modelCar: String,
    colorCar: String,
    yearColor: String,
    licensePlate: String,//Matricula del carro (placa)
    seating: Number // Asientos del carro

});
module.exports = mongoose.model('User',UserNride);

