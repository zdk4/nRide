var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//UserNride = UserSchema
const UserNride = new Schema({
    _id: Number,
    token: String,
    sessionId:String,
    attempts:Number,
    attemptDate:Number,
    createDate: Number,//checar estos antes
    Name: String,
    Addres:String,
    State: String,
    Birthdate: String,
    StateLives: Number,//estado donde vive pero su ID
    University: String,
    Phone: String,
    Password: { type: String, select:false},//false contraseña no envie al cliente en false
    ImageProfile: String,
    IDUniveristy: Number,
    CarrerUniversity: String,
    Email: { type: String, unique: true, lowercase:true},
    Constancy: String,//Constrancia de estudios
    Recipt:String,//Recibo de pago
    signupDate: { type: Date, default: Date.now()},//fecha en que se logea
    lastLogin: Date//fecha de su ultimo sesión
});
module.exports = mongoose.model('user', UserNride);

