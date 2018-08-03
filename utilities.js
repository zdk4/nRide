'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var fs = require('fs');
var secret = 'nRide2018';

//var transporter = nodemailer.createTransport(smtConfig);
var transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'f787bfa00af06aeedc71f0669e95c934', // generated ethereal user
        pass: '423f49d5596186b2c927b409cd2104b2' // generated ethereal password
    }
});


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

exports.sendEmailActivateAccount = function (emailData, callback) {
    //send mail with options
    var mail = {
        from: 'nRide <nride_app@hotmail.com >',
        to: emailData.toMail,
        subject: 'Activación cuenta nRide',
        // <a href=" '+emailData.tokenUrl+' ">Click aqui!!</a>
        html: '<b>Bienvenido '+emailData.name +'<br>Da click en el siguiente enlace para activar tu ceunta:<a href=" '+emailData.tokenUrl+' ">Click aqui!!</a><br>'+emailData.tokenUrl+'</b>'
        // template: 'ActivateAccount',
        /*context: {
            name: Data.name,
            token: Data.tokenUrl
        }*/
    }
    transporter.sendMail(mail, function (error, response) {
        if(error)
        {
            console.log("funcion transporter : "+error);
        }
        else{
            // console.log(response)
        }
        transporter.close();
    });
}

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

exports.SendEmail = function(emailData, callback){
    /*
 {
   "Body":"",
   "toMail":"",
   "Subject"
 }
 */

    var mailOptions = {
        from: 'nRide <nride_app@hotmail.com>',
        to: emailData.toMail,
        subject: emailData.Subject,
        text: emailData.Body
    }
    transporter.sendMail(mailOptions, function (error, response) {
        if(error)
        {
            console.log("Error al enviar email en Sen Email : "+error);
        }
        else{
             console.log('Email enviado de Sen Email')
        }
        transporter.close();
    });
}

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