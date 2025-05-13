require('dotenv').config({path: './.env.dev'})      //require dotenv
const { Client } = require('pg');   //module that helps connect with and interect with postgres
                                    //Client object helps interect with postgres

const {DB_PORT, DB_PASS, DB_NAME, DB_USER, DB_HOSTNAME} = process.env

const connectionObj = {         //creates connectionObj for auth
    host: DB_HOSTNAME,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS
}

console.log(`Connecting to DB: with connectionObj: ${JSON.stringify(connectionObj)}`)

const client = new Client(connectionObj)                //connect

client.connect()
.then(() => console.log(`Connected to ${DB_NAME} Database`))       //connected to database message
.catch((err) => console.log(`Error connecting to Database: ${err}`))     //error case


module.exports = client;
