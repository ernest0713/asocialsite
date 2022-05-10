const mongoose = require('mongoose');
const dotenv = require('dotenv');

// set env path
dotenv.config({path: './config.env'});

// connect Db cloud
const DB = process.env.DB_ADDRESS.replace('<password>', process.env.DB_PASSWORD)
mongoose.connect(DB)
    .then(()=>console.log('DB connect success'))
    .catch(e=>console.log('Connect fail! \n', e ));
