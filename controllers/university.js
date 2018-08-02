'use strict'

const careerUniversity = require('../models/career')
var utl = require('../utilities')

// Para obtener las carreras
function getCareer(req, res) {

    careerUniversity.find({}, (err,result) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición` })
        }
        if (!result) {
            return res.status(404).send({ message: `No hay carreras` })
        }
        res.status(200).send({ result })
    })
}

module.exports = {
    getCareer
}