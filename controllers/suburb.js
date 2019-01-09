'use strict'

var suburb = require('../models/suburb')

function getSuburb(req,callback){
    console.log(req)

    suburb.find({CP:req},function (err, result) {
        if (err) {
         callback(505,{ message: `Error al realizar la petición` })
      }
        if (!result) {
             callback(404,{ message: `No existen el codigo postal ingresado, verifique por favor` })
    }
    console.log(result)
        callback(200,{result})
    })
}

module.exports = {
    getSuburb
}

