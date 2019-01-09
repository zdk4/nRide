module.exports = {
    port: process.env.PORT || 3001,
     // db: process.env.MONGODB || 'mongodb://nrideapp5:nrideapp5@ds159651.mlab.com:59651/nride'
   db: process.env.MONGODB || 'mongodb://127.0.0.1:27017/nRide'
}


// mongoimport -h ds159651.mlab.com:59651 -d nride -c careers -u nrideapp5 -p nrideapp5 --file carrerasUaa2.csv --type csv --headerline
//mongoimport --db nRide --collection careers --type csv --file carrerasUaa2.csv --headerline
//mongoimport --db nRide --collection suburb --type csv --file CodigosPostal.csv --headerline