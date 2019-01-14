'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var fs = require('fs');
var secret = 'nRide2018';

var smtConfig = {
    host: 'in-v3.mailjet.com',
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'f787bfa00af06aeedc71f0669e95c934',
        pass: '423f49d5596186b2c927b409cd2104b2'
    }
};
var transporter = nodemailer.createTransport(smtConfig);

exports.createToken= function(user){

    var payload ={
        sub:user._id,//id del registro
        sessionId : user.sessionId,
        Name : user.Name,
        Addres : user.Addres,
        State : user.State,
        Birthdate : user.Birthdate,
        University : user.University,
        Phone : user.Phone,
        IDUniveristy : user.IDUniveristy,
        Email : user.Email,
        iat: moment.unix(),//fecha de creacion
        exp: moment(new Date()).add(7,'days').unix()//fecha de expiracion
    };

    return jwt.encode(payload, secret);

};
//Enviar email al activar cuenta
exports.sendEmailActivateAccount = function (emailData, callback) {
    // template
    var options = {
        viewEngine: {
            extname: '.hbs',
            layoutsDir: './Templates',
            partialsDir : './Templates'
        },
        viewPath: './Templates',
        extName: '.hbs'
    }
    transporter.use('compile', hbs(options))
    //send mail with options
    var mail = {
        from: 'nRide <nride_app@hotmail.com >',
        to: emailData.toMail,
        subject: 'Activación cuenta nRide',
        template: 'ActivateAccess',
       // html: '<b>Bienvenido '+emailData.name +'<br>Da click en el siguiente enlace para activar tu ceunta:<a href=" '+emailData.tokenUrl+' ">Click aqui!!</a><br>'+emailData.tokenUrl+'</b>'
        context: {
            name: emailData.name,
            token: emailData.tokenUrl
        }
    }
    transporter.sendMail(mail, function (error, response) {
        if(error)
        {
            console.log("funcion smtConfig : "+error);
        }
        else{
             console.log('envio correo para perificar cuenta')
        }
        transporter.close();
    });
}
//Generar password
exports.generatePassword = function(callback){
    var pass="";
    var chars = "0123456789abcdqrstuvwxyzABCDEFGHIJKLMNOP";
    var rand=""

    for (var x=0; x < 8; x++)
    {
        rand = Math.floor(Math.random()*chars.length);
        pass += chars.substr(rand, 1);
    }

    if(pass =="")
    {
        callback(400);
    }
    else {
        callback(null,pass);
    }


}
//Enviar email
exports.SendEmail = function(emailData, callback){
    var options = {
        viewEngine: {
            extname: '.hbs',
            layoutsDir: './Templates',
            partialsDir : './Templates'
        },
        viewPath: './Templates',
        extName: '.hbs'
    }

    transporter.use('compile', hbs(options))
    //send mail with options
    var mail = {
        from: 'nRide <nride_app@hotmail.com >',
        to: emailData.toMail,
        subject: emailData.subject,
        template: 'PasswordForget',
        // html: '<b>Bienvenido '+emailData.name +'<br>Da click en el siguiente enlace para activar tu ceunta:<a href=" '+emailData.tokenUrl+' ">Click aqui!!</a><br>'+emailData.tokenUrl+'</b>'
        context: {
            name: emailData.name,
            password: emailData.password
        }
    }
    transporter.sendMail(mail, function (error, response) {
        if(error)
        {
            console.log("funcion smtConfig : "+error);
        }
        else{
             console.log(response)
        }
        transporter.close();
    });
}
//decodificar el token 
exports.decodeToken = function(token, callback){

    try
    {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment.unix())
        {
            callback(401);
        }
        else
        {
            callback(null,payload);
        }

    }
    catch(ex)
    {
        console.log("console ex decode",ex);
        callback(404);
    }

};