require('dotenv').config()      //require dotenv
const mongoose = require('mongoose');   //require mongoose


const {DB_USER, DB_PASS, DATABASE, URI} = process.env

const URL = `${URI}/${DATABASE}`

const connectionObj = {         //creates connectionObj for auth
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS
}

mongoose.connect(URL, connectionObj)                //connect
.then(() => console.log(`Connected to ${DATABASE} Database`))       //connected to database message
.catch((err) => console.log(`Error connecting to Database: ${err}`))     //error case


