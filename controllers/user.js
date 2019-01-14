'use strict'
const bcrypt = require('bcrypt-nodejs') //libreriria para contraseña encriptada
const crypto = require('crypto')
var userNride = require('../models/user') //Para utlizar el modelo usuario
var utl = require('../utilities')
var formidable = require("express-formidable")
var server = 'https://nride.herokuapp.com/api/';
// var server = 'http://localhost:3001/api/';


//Para registrar un usuario
function saveUser(req, res) {
    // app.use(formidable.parse({ keppExtensions: true}));
    /*Checar el in archivo de json que  */
    var user = new userNride();
    var token = utl.createToken(req.body);
    user._id = (new Date()).getTime()
    user.createDate = (new Date()).getTime(); //checar estos antes
    user.Name = req.body.Name;
    user.Addres = req.body.Addres;
    user.State = req.body.State;
    user.Birthdate = req.body.Birthdate;
    user.StateLives = req.body.StateLives;
    user._idStateLives = req.body._idStateLives;
    user.University = req.body.University;
    user._idUniversity = req.body._idUniversity;
    user.Phone = req.body.Phone;
    user.ImageProfile = req.body.ImageProfile;
    user.IDUniveristy = req.body.IDUniveristy;
    user.CarrerUniversity = req.body.CarrerUniversity;
    user._idCarrerUniversity = req.body._idCarrerUniversity;
    user.Email = req.body.Email;
    user.Constancy = req.body.Constancy;
    user.Recipt = req.body.Recipt;
    user.emailValidate = false;
    user.token = token;
    //Valida email
    userNride.findOne({
        Email: req.body.Email.toLowerCase()
    }, (error, result) => {
        if (error) {
            console.log("error al checar email", error);
        } else if (result) {
            //Hay emails repetidos
            res.status(403).send({
                message: `Email duplicado`
            })
        } else {
            if (req.body.Password) {
                //Encriptar contraseñas
                bcrypt.hash(req.body.Password, null, null, function (err, hash) {
                    user.Password = hash;
                    //Almacenar datos del usuario
                    user.save((err, userSave) => {
                        if (err) {
                            res.status(500).send({
                                message: `Error al salvar la base de datos: ${err}`
                            })
                        } else {
                            var email = {
                                toMail: req.body.Email,
                                name: req.body.Name,
                                tokenUrl: server + 'verifyToken/' + token
                            }
                            utl.sendEmailActivateAccount(email, function (error, result) {
                                if (error) {
                                    console.log('Error al enviar el email con el token')
                                    // res.status(500).send({ message: `Error al al mandar el email: ${error}` });
                                } else {
                                    console.log('Email enviado con usuario registrado')
                                }


                            });
                            res.status(201).send({
                                message: 'Usuario Guardado verifique email'
                            })

                        }
                    })

                })
            } else {
                console.log('Entro al false de que no hay contraseña en el login')
            }

        }
    })
}
//Obtener usuario
function getUser(req, res) {

    userNride.find({}, (err, userResult) => {
        if (err) {
            return res.status(500).send({
                message: `Error al realizar la petición`
            })
        }
        if (!userResult) {
            return res.status(404).send({
                message: `No existen usuarios`
            })
        }

        res.status(200).send({
            userResult
        })

    })
}
// Login
function login(req, callback) {
    userNride.findOne({
        Email: req.Email.toLowerCase()
    }, (err, user) => {
        if (err) {
            // console.log(JSON.stringify(err));
            callback(500, {
                message: err
            })
        } else {
            if (!user) {
                callback(404, {
                    message: 'Email no encontrado'
                })
            } else {
                //Comparar contraseña
                bcrypt.compare(req.Password, user.Password, function (err, check) {
                    if (check) { //verifica si el email ya es valido
                        if (user.emailValidate) {
                            try {
                                //actualizar el id de sesion, convertir usuario en un token y guardarlo en cookies
                                user.set({
                                    sessionId: (new Date()).getTime()
                                });
                                user.save((e, userUpd) => {
                                    if (e) {
                                        //checar queestado le regresamos
                                        callback(500, {
                                            message: 'No se pudo iniciar la session'
                                        })
                                    } else {
                                        //crear y regresar el token
                                        var token = utl.createToken(userUpd);
                                        callback(null, {
                                            token
                                        })

                                    }
                                });
                            } catch (e) {
                                console.log('Error al guardar por que :', e)
                            }
                        } else { //contraseña incorrecta
                            callback(404, {
                                message: 'Email aun no se ha activado'
                            })
                        }
                    } else {
                        //contraseña incorrecta
                        callback(404, {
                            message: 'Contraseña incorrecta'
                        })
                    }
                });
            }
        }
    });


}
//Verificar token cuando se enviar el correo
function verifiyToken(req, callback) {

    userNride.findOne({
        token: req
    }, function (error, user) {
        if (error) {
            res.status(500).send({
                message: `Error al buscar token ${error}`
            })
        } else if (user) {
            user.set({
                emailValidate: true
            })
            user.save(function (err, userUpd) {
                if (err) {
                    console.log(JSON.stringify(err));
                    callback(500)
                } else {
                    callback(200, {
                        message: 'Usuario activado'
                    })
                    //res.status(200).send({ message: `Usuario activado` })
                }

            });
        } else {
            callback(404, {
                message: `Usuario no encontrado`
            })
            // res.status(404).send({ message: `Usuario no encontrado` })
        }
    })
}
//Resetear password
function resetPassword(req, res) {
    userNride.findOne({
        Email: req.body.Email
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: `Error al encontrar el email en la base de datos: ${err}`
            })
        } else if (user) {
            //Verificamos si el email fue valido
            if (user.emailValidate) {
                utl.generatePassword(function (err, resul) {
                    if (err) {
                        res.status(500).send({
                            message: `Error email no valido: ${err}`
                        })
                    } else {
                        var temporalPass = resul;
                        //encriptar contraseña y guardarla
                        bcrypt.hash(temporalPass, null, null, function (err, hash) {
                            var pass = hash;
                            user.set({
                                Password: pass
                            });
                            user.save(function (e, updUser) {
                                if (e) {
                                    res.status(500).send({
                                        message: `Error al guardar contraseña: ${err}`
                                    })

                                } else {
                                    //enviar email de nueva contraseña
                                    var EmailSend = {
                                        name: user.Name,
                                        password: temporalPass,
                                        toMail: user.Email,
                                        subject: "Restablecer contraseña"
                                    }

                                    utl.SendEmail(EmailSend, function (eMail, rMail) {
                                        if (error) {
                                            console.log('Error al enviar el email con recuperar password')
                                            // res.status(500).send({ message: `Error al al mandar el email: ${error}` });
                                        } else {
                                            console.log('Email enviado con contraseña nueva')
                                        }

                                    });
                                    res.status(201).send({
                                        message: 'Contraseña Cambiada'
                                    })


                                }

                            });
                        });
                    }
                })
            }
        }

    })
}
// checkSession
function checkSession(token, callback) {
    if (token) {
        utl.decodeToken(token, (error, result) => {
            if (error) {
                console.log("error callback checksession", error);
                callback(error);
            } else {
                userNride.findById((result.sub * 1.0), (err, user) => {
                    if (err) {
                        console.log('Console json error')
                        console.log(JSON.stringify(err));
                        callback(err);
                    } else if (!user) {
                        //no se encontro ese id
                        callback(404);
                    } else if (result.sessionId == user.sessionId) {
                        callback(null, {
                            _id: user._id
                        });
                    } else {
                        callback(405);
                    }
                });
            }
        })
    } else {
        callback(405)

    }
}
//Logout
function logout(token) {

    //decodificar el token para validar lo que hay en bd
    utl.decodeToken(token, function (error, result) {
        if (error) {
            console.log('token logout error: ', error);
            //callback(error);
        } else {
            //console.log(result);
            userNride.findById((result.sub * 1.0), (err, user) => {
                if (err) {
                    console.log(JSON.stringify(err));
                } else if (!user) {
                    //console.log("algo");
                    //no se encontro ese id
                    console.log("no user found");
                } else {
                    user.set({
                        sessionId: null
                    });
                    user.save(function (e, usr) {
                        if (e) {
                            console.log(e);
                        } else {
                            console.log('Se guardo session null al eliminar')
                        }

                    });
                }



            });

        }

    });

}
module.exports = {
    saveUser,
    getUser,
    login,
    verifiyToken,
    resetPassword,
    checkSession,
    logout
}