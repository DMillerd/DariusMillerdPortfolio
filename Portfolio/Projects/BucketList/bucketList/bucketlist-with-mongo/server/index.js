// import all the modules needed
const express = require('express');
const logger = require('morgan');
const path = require('path');
// Allow requests from different domains or aka origins - 
// cross origin resource sharing
const cors = require('cors');

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
require('./connections/mongoConn.js');

//import model
const ItemsModel = require('./models/BucketList.js');


// ROUTE HANDLERS
app.get('/', (req, res) => {
  res.send("I am the root route.")
})

// Create - POST
app.post('/api/bucket', (req, res) => {
  //call of to the db - N/A
  //wait for the db to respond - N/A
  let { description } = req.body

  if (description){
    ItemsModel.create({ description })
      .then(result => {
        res.status(201).json(result)
      })
      .catch(err => {
        console.log("error posting", err)
        res.status(400).json({ message: "Server Error: Failed to create item", err })
      })

  }



})

// Read - GET
app.get('/api/bucket', (req, res) => {

  ItemsModel.find({})
    .then(items => {
        res.json(items)
    })
    .catch(error => res.status(500).json({message: "Server Error: failed to retrieve items", error}
    ))
})

// Update - PUT - 
app.put('/api/bucket/:id', (req, res) => {
  let requestedId = req.params.id;
  //need to find item you want to update
  ItemsModel.findById(requestedId)            //finds by _id
  //can also .updateOne({ _id: reqID}, $bit: {isComplete: {xor: 1}})    //using xor
  .then(result => {
    result.isComplete = !result.isComplete      //toggles boolean
    //save to db
    result.save()
    .then(updatedResult => {
      res.json(updatedResult)
    })
  })
  .catch(error => res.status(500).json({message: "Server Error: failed to update items", error}
  ))








})

// Delete - DELETE
app.delete('/api/bucket/:id', (req, res) => {
  // find the requested id
  const {id} = req.params;

  ItemsModel.findByIdAndDelete(id)
  .then(result => res.json(result))
  .catch(error => res.status(500).json({message: "Server Error: failed to delete items", error}
  ))
})

// Listening for incoming requests
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`))


