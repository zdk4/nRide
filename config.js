module.exports = {
    port: process.env.PORT || 3001,
     db: process.env.MONGODB || 'mongodb://nrideapp5:nrideapp5@ds159651.mlab.com:59651/nride'
  //  db: process.env.MONGODB || 'mongodb://127.0.0.1:27017/nRide'
}


// mongoimport -h ds159651.mlab.com:59651 -d nride -c careers --type csv -u nrideapp5 -p nrideapp5 --file
