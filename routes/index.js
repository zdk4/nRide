'use strict'

const express = require('express')
const userCtrl = require('../controllers/user')// Utilizar modelo para usuario
const university = require('../controllers/university')
const suburb = require('../controllers/suburb')


const api = express.Router()
const portalSession = require('express-session');//para las sessiones
const redisStore = require("connect-redis")(portalSession);
const key = require('../keys');


const sessionMiddleware = portalSession({
    store: new redisStore({}),
    secret:"nRide"
});
api.use(sessionMiddleware);

//Logi para entrar a session
api.post('/login', (req,res) => {
    userCtrl.login(req.body,(error,result) => {
        if(error)
        {
          //  console.log(JSON.stringify(error));
            res.status(error).send(result);
        }
        else
        {

           req.session = result.token;
             console.log(req.session);
            res.status(200).send({});
        }
    })
})
//Obtener Usuario
api.get('/getUserRider',userCtrl.getUser)
//Registrar Usuario
api.post('/registerUser',userCtrl.saveUser)
// Validar token que se envia al correo
api.get('/verifyToken/:token', (req,res) => {
    userCtrl.verifiyToken(req.params.token,(error) => {
        if(error)
        {
           // console.log(JSON.stringify(error));
            res.status(error).send();
        }
        else
        {
            res.status(200).send({});
        }
    })

})
//resetear password
api.put('/resetPassword', userCtrl.resetPassword)
//logout
api.delete('/logout', (req,res) => {
    userCtrl.checkSession(req.session,(error) =>
    {
        if(!error)
        {
           userCtrl.logout(req.session);
        }
        delete req.session;
        res.status(200).send({message:'Session cerrada'});
    })
});

/*---------------- Universidad ----------------*/
api.get('/getCareer',university.getCareer)


/*----------------- Fraccionamiento ----------------*/
//Obtener fraccionamiento al traer cp
api.get('/getSuburb/:cp', (req,res) => {
    suburb.getSuburb(req.params.cp,(error) => {
        if(error)
        {
            // console.log(JSON.stringify(error));
            res.status(error).send();
        }
        else
        {
            res.status(200).send({});
        }
    })

})
module.exports = api
