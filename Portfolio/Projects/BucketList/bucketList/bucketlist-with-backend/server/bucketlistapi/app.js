//import modules
const serverless = require('serverless-http')
const express = require('express');
const app = express();              //create an instance (object) based on express
// const logger = require('morgan');
const cors = require('cors');       //Allow requests from different domains or aka origins (Cross Origin Resource Sharing)
const PORT = process.env.PORT || 3000;      //defines a variable PORT that keeps the port we run the api on

//Foundation
//middleware - anything that runs after a request but before sending a response
// app.use(express.static('../client'))
app.use(cors());        //opens up the server to accept incoming requests from different origins
// app.use(logger('dev'));     //logs incoming requests to the console
app.use(express.urlencoded({ extended: false}));            //parses incoming requests with urlencodeed body payloads, using qs library
//parses incoming requests with json body payloads
app.use(express.json());            //used to parse in the coming req body


const bucketListArray = require('./bucketlist');


//ROUTE HANDLERS
//routes
app.get('/', (req, res) => {-
    res.send("root route")
})

//create
app.post('/api/bucket' , (req, res) => {
    //call - NA
    //wait for the db to respond - NA

    //Save to bucketList

    let { description } = req.body  //description from the request
    let obj = {
        id: Date.now(),             //id is the date/time
        description: description.substr(0, 30),     //limits the amout of data in description sent
        isComplete: false           //default value
    }
    bucketListArray.push(obj)       //pushes to our array

    //sends only the new data back
    res.send(obj)           //ends request, must end request, otherwise the post will keep requesting
    //send
})

//read
app.get('/api/bucket', (req, res) => {
    res.send(bucketListArray)
})


//update
app.put('/api/bucket/:id', (req, res) => {
    let requestedId = req.params.id;    //gets the requested id out of the url

    //find a reference (pointer) to the object
    //in the bucketListArray that has the id

    let foundObj = bucketListArray.find(function(e){
        return e.id == requestedId
    })
    if(foundObj){   //if foundObj exists
        //update the foundObj in the array, Toggles
        foundObj.isComplete = !foundObj.isComplete;
        //return changed object back to client
        res.json(foundObj)
    } else {
        res.json({status: 404, message: `The id "${requestedId}" does not exist`})
    }
    

})


//delete
app.delete('/api/bucket/:id', (req, res) => {
    let requestedId = req.params.id;    //gets the requested id out of the url

    //find a reference (pointer) to the object
    //in the bucketListArray that has the id

    let foundIndex = bucketListArray.findIndex(function(e){
        console.log(requestedId)
        return e.id == requestedId
        
    })
    if(foundIndex === -1){
        res.status(404).json({status: 404, message: `The id "${requestedId}" does not exist`})
        return false;
    }
    //delete object
    bucketListArray.splice(foundIndex, 1)
    //return deleted object back to client
    res.json(bucketListArray)
})



//export it so aws cloudformation can pick it up
module.exports.handler = serverless(app)


//Listener (listening done by cloud service)
// app.listen(PORT, () => {
//     console.log(`server listening on ${PORT}`)
// })

