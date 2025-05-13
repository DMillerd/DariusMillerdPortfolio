// import all the modules needed
const express = require('express');
const logger = require('morgan');
const path = require('path');
// Allow requests from different domains or aka origins - 
// cross origin resource sharing
const cors = require('cors');

//import db connection client
const client = require('./connections/dbConn.js');   ///this is the problem CHANGE THIS 



// Create an instance (object) based on express
const app = express();
// define a variable PORT that keeps the port we run the api on
const PORT = process.env.PORT || 3000;


app.use(cors());
// logs incoming requests to the console
app.use(logger('dev'));
// parses incoming requests with urlencoded body payloads, using qs library
app.use(express.urlencoded({ extended: false }));
// parses incoming requests with JSON body payloads
app.use(express.json());

// mock data 
//const bucketListArray = require('./data/bucketlist')

//Bring in our db connection
require('./connections/dbConn.js');

//import model


// ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send(`I am the bucketlist API, running on port ${PORT}`)
})

// Create - POST
app.post('/api/bucket', (req, res) => {
  //call of to the db - N/A
  //wait for the db to respond - N/A
  let { description } = req.body;
  let user_id = req.query.id;

//query to insert
  let query = `INSERT INTO hr.bucketlist_items
                  (description, user_id)
                VALUES ('${description}', ${user_id})
                RETURNING *,
                item_id AS "_id",
                is_complete AS "isComplete";`

  //console.log('query', query)
  //res.end();

  client.query(query)
  .then(data => {
    console.log(data.rows[0])
    res.json(data.rows[0])
  })
  .catch(err => console.log('Error: ', err))
})

// Read - GET
app.get('/api/bucket', (req, res) => {

  let query = `SELECT *,
                item_id AS "_id",
                is_complete AS "isComplete"
                FROM hr.bucketlist_items
                WHERE user_id = 7
                ORDER BY created_timestamp;`

    client.query(query)
    .then(data => {
        res.json(data.rows)
    })
    .catch(error => res.status(500).json({message: "Server Error: failed to retrieve items", error}
    ))
})

// Update - PUT - 
app.put('/api/bucket/:id', (req, res) => {
  let requestedId = req.params.id;

  let query = `UPDATE hr.bucketlist_items
                SET is_complete = NOT is_complete
                WHERE item_id = ${requestedId}
                RETURNING *;`

  client.query(query)
  .then(result => {
    res.json(result.rows[0])
    })
    .catch(error => res.status(500).json({message: "Server Error: failed to retrieve items", error}
    ))
})

// Delete - DELETE
app.delete('/api/bucket/:id', (req, res) => {
  // find the requested id
  const {id} = req.params;

  let query = `DELETE FROM hr.BUCKETLIST_ITEMS
                WHERE item_id = ${id}
                RETURNING *;`

  client.query(query)
  .then(result => res.json(result))
  .catch(error => res.status(500).json({message: "Server Error: failed to delete items", error}
  ))
})

// Listening for incoming requests
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`))


