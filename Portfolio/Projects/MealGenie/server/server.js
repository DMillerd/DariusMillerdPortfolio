//import dependencies
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
//to-do: env
const path = require('path');
//express app and port
const app = express();
const PORT = 3000;          //can integrate env later, ask about env being gitignored

// Dotenv config
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// Setting the API token for Spoonacular 
const apiToken = process.env.TOKEN


//middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Set the base URL for Spoonacular
const baseURL = "https://api.spoonacular.com/recipes";


//require db connection
require('./connections/mongoConn.js');

//db model
const UserDataModel = require('./models/UserData.js')
const RecipesModel = require('./models/Recipes.js')
const SavedUserRecipesModel = require('./models/SavedUserRecipes.js')



//root route
app.get('/', (req, res) => {
    res.send(`Root route of MealGenie Server on port: ${PORT}`);
});

//other routes
/*
DEFINING ROUTES:
*/

/* GET Routes (cRud) */

/*
# GET saved meals
app.get('/mealgenie/saved', (req, res) => {
    # Code to display saved meals
});
*/

/*
# GET grocery list
app.get('/mealgenie/grocerylist/:id', (req, res) => {
    # Code to display grocery list for a meal 
});
*/
let randomRecipes = [];
app.get('/mealgenie/meal/random', (req, res) => {
    // Expecting comma separated include and exclude
    const { include, exclude } = req.query
    console.log(`Include: ${typeof include}`)
    console.log(`Exclude: ${typeof exclude}`)

    // Create the URL
    url = baseURL + `/random?apiKey=${apiToken}&number=3`

    // Append preferences to be included in search (e.g. dietary restriction, cuisines)
    if (include) {
        console.log(include)
        url += `&include-tags=${include}`
    }
    // Append anything to be excluded from the search (e.g. intolerances, cuisines)
    if (exclude) {
        url += `&exclude-tags=${exclude}`
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            randomRecipes = data.recipes;    //ended up finding out that randomRecipes wasn't being updated, so now randomRecipes should get the data
            //console.log(randomRecipes)
            res.json(data)
        })
        .catch(error => {
            console.log(error.message)
            res.json(error)
        })
    // code I'll need later - NS
    //     let test = (JSON.stringify([{"userPreferences":{"cuisines":[],"intolerances":[],"dietaryRestrictions":["Ketogenic","Vegan"],"protein":null,"prepTime":null},"_id":"68085d9f5e1c398ad3dc44d8","userID":"1234","savedRecipes":[],"__v":1}]));
    // // Expected output: '{"x":5,"y":6}'
    // new_test = JSON.parse(test)
    // let protein = null
    // let dietaryRestrictions = []
    // let cuisines = []
    // let intolerances = []

    // for (const [key, value] of Object.entries(new_test[0]['userPreferences'])) {

    //   // console.log(`${value}: ${typeof JSON.stringify(value)}`)

    //   if(key === "intolerances") {
    //     intolerances = JSON.parse(JSON.stringify(value))
    //   }
    //   if(key === "cuisines") {
    //     cuisines = JSON.parse(JSON.stringify(value))
    //   }
    //   if(key === "protein") {
    //     protein = protein
    //   }
    //   if(key === "dietaryRestrictions") {
    //     dietaryRestrictions = JSON.parse(JSON.stringify(value))
    //   }
    // }

    //   userID = new_test[0]['userID']

    //   console.log(userID)
    //   console.log(protein)
    //   console.log(dietaryRestrictions)
    //   console.log(cuisines)
    //   console.log(intolerances)
})


// Get method to retrieve preferences for a particular user from the database. Tested from Postman
// TODO: Test from frontend 

app.get('/mealgenie/user/preference', (req, res) => {
    // Fetch the User ID from the request query 
    const { userID } = req.query

    // If the user is undefined, throw an error
    if (!userID) {
        res.status(404).json("Error: Please provide a user ID.")
    }
    else {
        // Find the user 
        UserDataModel.find({ userID: userID })
            .then(result => {
                // If the result is "", user does not exist
                if (result == "") {
                    res.status(404).json({ message: "No user with that ID" })
                }
                // Return the record
                else {
                    res.status(200).json(result)
                }
            })
            // Catch any error
            .catch(error => {
                res.status(404).json(error)
            })
    }

})

// Post method to insert a new user into the database. Tested from Postman
// TODO: needs to be tested from the frontend

app.post('/mealgenie/user/preference', (req, res) => {
    // Front end needs to provide the following fields in the request body:
    // Required: User ID
    // Optional: cuisine, intolerance, dietary restriction, protein, prep time and saved recipe ID
    // Call this API whenever creating a new user.

    // const { userID, cuisines, intolerances, dietaryRestrictions, protein, prepTime, savedRecipes } = req.body
    const { userID } = req.body

    let newUser = {}
    newUser['userPreferences'] = {}
    // Validate fields

    if (!userID) {
        res.status(404).json("Error: Please provide a user ID.")
    }
    else {
        // Create a new record with user ID, preferences if applicable, and saved recipe ID if applicable
        UserDataModel.findOne({ userID: userID })
            .then(result => {
                // If the result is null, user does not exist
                if (result == null) {
                    newUser['userID'] = userID
                    newUser.userPreferences.cuisines = []
                    newUser.userPreferences.intolerances = []
                    newUser.userPreferences.dietaryRestrictions = []
                    newUser.userPreferences.protein = null
                    newUser.userPreferences.prepTime = null
                    newUser.userPreferences.mealType = []
                    newUser['savedRecipes'] = []
                    UserDataModel.create(newUser)
                        .then(createdUser => {
                            console.log("Created")
                            res.status(201).json(createdUser)
                        })
                        .catch(err => res.status(500).json({ message: "Server error: Failed to create new user" }))
                }
                else {
                    res.status(403).json({ message: "Server error: User already exists" })
                }
            })
    }
})


// This route will be called when updating the user preferences, tested from frontend when user saves preferences
app.put('/mealgenie/user/preference', (req, res) => {
    // Required: userID
    // Will add preferences for an existing user

    const { userID, cuisines, intolerances, dietaryRestrictions, protein, prepTime, mealTypes, savedRecipes } = req.body


    // If user is undefined, throw an error 
    if (!userID) {
        res.status(404).json("Error: Please provide a user ID.")
    }
    else {
        // Find the user 

        UserDataModel.findOne({ userID: userID })
            .then(result => {
                console.log(result)
                // If the result is "", user does not exist
                if (!result) {
                    console.log("User doesn't exist")
                    res.status(404).json({ message: "No user with that ID" })
                }
                // Update the record
                else {
                    // Add new cuisines
                    if (cuisines && Array.isArray(cuisines)) {
                        result.userPreferences.cuisines = cuisines

                    }
                    // Add intolerances
                    if (intolerances && Array.isArray(intolerances)) {
                        result.userPreferences.intolerances = intolerances
                    }
                    // Add dietary restrictions
                    if (dietaryRestrictions && Array.isArray(dietaryRestrictions)) {
                        result.userPreferences.dietaryRestrictions = dietaryRestrictions
                    }
                    // Add meal types
                    if (mealTypes && Array.isArray(mealTypes)) {
                        result.userPreferences.mealTypes = mealTypes
                    }
                    // Add protein goal
                    if (protein !== undefined && protein !== null && typeof protein === 'number') {
                        result.userPreferences.protein = protein
                    }
                    // Add prep time
                    if (prepTime !== undefined && prepTime !== null && typeof prepTime === 'number') {
                        result.userPreferences.prepTime = prepTime
                    }
                    // If there are any saved recipes to add, add them
                    if (savedRecipes && Array.isArray(savedRecipes)) {
                        result.userPreferences.savedRecipes = savedRecipes
                    }
                    // save the results
                    return result.save()
                }
            })
            .then(updatedResult => {
                res.json(updatedResult)
            })
            // Catch any error
            .catch(error => {
                res.status(500).json(error)
            })
    }
})

// Delete method to delete a user from the User database

// Delete - DELETE
// This route should be called if the user needs to be deleted. Tested with Postman
// TODO: needs to be tested from frontend and need to add logic to delete userID from saved recipes db 
app.delete('/mealgenie/user/preference', (req, res) => {
    // find the requested id
    const { userID } = req.query;
    // Delete the user for the given ID

    UserDataModel.deleteOne({ userID: userID })
        .then(result => {
            console.log(result)
            res.status(200).send({ message: "User was deleted" })
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ message: "Error in deleting user." })
        })


})



//Any questions or concerns, please let me know! -DM

//--------------------------------------------
// Old API route code
// Get 3 meal recommendations
// app.get('/mealgenie/recommendations', (req, res) => {
//     const { intolerances, diet, protein, cuisine, type } = req.query
//     /* 
//     diet: https://spoonacular.com/food-api/docs#Diets
//     if diet is more than one, it must be passed as comma separated or pipe (|). 
//     comma separated means AND, so the recipe should not contain any of the dietary restrictions.
//     pipe means OR, so for example, the recipe can be vegan OR vegetarian
//     */

//     /* 
//     intolerances: https://spoonacular.com/food-api/docs#Intolerances
//     if intolerances is more than one, it must be passed as comma separated.
//     comma separated means AND, so the recipe cannot contain any intolerances.
//     */

//     /* 
//     protein:
//         This will be passed to Spoonacular as minProtein. 
//         So if protein = 10, the recipe must have at least 10 grams of protein 
//     */

//     /* 
//         Cuisine: https://spoonacular.com/food-api/docs#Cuisines
//         Comma separated is interpreted as "OR"
//     */

//     /*
//         Meal type: https://spoonacular.com/food-api/docs#Meal-Types
//         Only one type is accepted, no comma separated values allowed
//     */
//    // Append the complexSearch path to the URL to be able to search meals, set number to 3 to get 3 results, and random results 
//     let mealRecURL = baseURL + `/complexSearch?apiKey=${apiToken}&number=3&sort=random`

//     // Append query parameters if were provided from the frontend (if they're not undefined)
//     if (protein) {
//         mealRecURL += `&minProtein=${protein}`
//     }
//     if (intolerances) {
//         mealRecURL += `&intolerances=${intolerances}`
//     }
//     if (diet) {
//         mealRecURL += `&diet=${diet}`
//     }

//     if(cuisine) {
//         mealRecURL += `&cuisine=${cuisine}`
//     }

//     if(type) {
//         mealRecURL += `&type=${type}`
//     }
//     // fetch the endpoint
//     fetch(mealRecURL)
//     .then(response => response.json())
//     // TODO: Return data to frontend
//     .then(data => {
//         console.log(data)
//         res.json(data)
//     })
//     .catch(error => {
//         console.log('Error:', error.message)
//         res.json(error)
//     });

// });


/*
# GET user preferences
app.get('/mealgenie/profile/preference', (req, res) => {
    # Code to display user's meal preferences
});
*/

/* POST routes (Crud) */

/*
# Add a meal to saved meals

app.post('/mealgenie/saved', (req, res) => {
    # Code to display user's meal preferences
});
 
*/

/*
# Add a meal to saved meals

app.post('/mealgenie/saved', (req, res) => {
    # Code to add a meal to saved meals
});
 
*/

/*
# Add a meal preference to user's profile

app.post('/mealgenie/profile/preference', (req, res) => {
    # Code to add meal preference to profile
});
 
*/

/*
# Create a grocery list for a meal

app.post('/mealgenie/grocerylist', (req, res) => {
    # Code to create grocery list for a meal
});
 
*/

/* DELETE routes (cruD) */

/*
# Delete a grocery list

app.delete('/mealgenie/grocerylist', (req, res) => {
    # Code to delete a grocery list for a meal
});
 
*/

/*
# Delete a meal preference

app.delete('/mealgenie/profile/preference', (req, res) => {
    # Code to delete a grocery list for a meal
});
 
*/

/*
# Delete a meal preference

app.delete('/mealgenie/profile/preference', (req, res) => {
    # Code to delete a grocery list for a meal
});
*/

/*
# Delete a saved recipe

app.delete('/mealgenie/saved', (req, res) => {
    # Code to delete a saved recipe
});
*/


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

//SAVEDMEALS FOR DB
//VERY MUCH A WORK IN PROGRESS, BUT POST AND GET DO WORK, JUST NEED API RECIPE PAGE FUNCTIONALITY IN ORDER TO PULL FROM THAT DB ACCURATELY.

/*

IT MIGHT BE IMPORTANT TO RATE LIMIT THE SAVE BUTTON


C
    FIRST CHECKS IF RECIPE ID EXISTS
    IF NOT
        Recipe is saved for the first time, then users id is pushed to users saved array
    IF IT DOES EXIST
        ONLY push to users saved array, and ONLY if userID is not already present
R
    Saved recipes tab gets data for as many recipes that the user has saved when they access the saved recipes tab
U
    Update users saved to remove user that REMOVES FROM SAVED
D
    Deletes recipe when the last user (users saved == 0)
        But WHEN WILL DELETE BE CALLED? if we arent already checking to see if users saved in array is 0?
        maybe at the end of put check? and if the length of usersSaved is 0, then call DELETE?


        ALTERNATIVELY

C
    FIRST CHECKS IF RECIPE ID EXISTS
    IF NOT
        Recipe is saved for the first time, then users id is pushed to users saved array
    IF IT DOES EXIST
        ONLY push to users saved array, and ONLY if userID is not already present
R
    Saved recipes tab gets data for ALL recipes that the user has saved when they access the saved recipes tab      //works
U
    IF user id is not in usersSaved
        Adds user's id to usersSaved
    
D
    Update users saved to remove user that REMOVES FROM SAVED
    CHECK IF (users saved == 0)
        Deletes recipe when the last user (users saved == 0)

        //


*/
//POST FOR SAVEDMEALS
app.post('/mealgenie/savedrecipes', (req, res) => {      //recipe saved for first time!
    //what does it mean for the first time? how do I detect that?
        //for post, have it create after checking if it exists? otherwise duplicates will happen
        //
//const {id} = req.params;
//check if requested recipe has an entry already, if not, continue,
// const recipeIndex = 0; 
const savedRecipe = {   //get from random recipes page
// recipeID: randomRecipes[recipeIndex].id,
// recipeName: randomRecipes[recipeIndex].title,
// recipeDisplay:{
// recipeImage: randomRecipes[recipeIndex].image,
// recipeSummary: randomRecipes[recipeIndex].summary,
// recipeIngredients: randomRecipes[recipeIndex].ingredients,
// recipeInstructions: randomRecipes[recipeIndex].instructions
id: req.body.id,
title: req.body.title,
image: req.body.image,
summary: req.body.summary,
extendedIngredients: req.body.extendedIngredients,
analyzedInstructions: req.body.analyzedInstructions,
usersSaved: req.body.usersSaved      //add first userID, still temporary
}
SavedUserRecipesModel.create(savedRecipe)
.then(data => {
console.log(`saved data: ${data}`)
res.status(201).json(data)
})
.catch(err => res.status(500).json({ message: "Server Error: Failed to save recipe.", err }))
})

//CHECK FOR EXISTING IN SAVEDMEALS

app.get(`/mealgenie/allsavedrecipes`, (req, res) => {
    const { userID, recipeID } = req.query
    SavedUserRecipesModel.find({ id: recipeID })                                      //--test if this works    find recipeID in savedUserRecipesModel
        .then(data => {
            console.log(data)
            console.log('datafromfirstfind')
            if (data.length > 0) {                                                                              //if it finds it
                console.log(data[0].usersSaved)
                if(data[0].usersSaved.includes(userID))
                {
                    console.log(data)
                    console.log("DELETE PATH")
                    res.json("DELETE")
                } else if(!data[0].usersSaved.includes(userID)){
                    console.log(userID)
                    console.log(data)                                                                //if it doesnt find it set to PUT user in
                    console.log("PUT PATH")
                    res.json("PUT")
                }
                /*SavedUserRecipesModel.find({ id: recipeID, usersSaved: { $in: [userID] } })                                   //find userID in that recipe
                    .then(data => {
                        console.log(data)
                        if (data.length > 0) {                                                                  //if user already saved, DELETE
                            
                        } else {
                            
                        }
                    })
                    .catch(error => res.status(500).json({ message: "Server Error: Failed to find recipe", error }
                    ))*/
            } else if (data.length == 0){
                console.log(data)                                                                       //if we don't find the recipe in saved, POST new one
                console.log("POST PATH")
                res.json("POST")
            } else {
                console.log(`testing no path: ${data}`)
                console.log("NO PATH")
                res.json("N/A")
            }
        })
        .catch(error => res.status(500).json({ message: "Server Error: Failed to retrieve saved recipes.", error }
        ))
})

//GET FOR SAVEDMEALS
app.get('/mealgenie/savedrecipes', (req, res) => {                      //gets all the saved recipe info for the user to see on the favorited recipes page
const { userID } = req.query
    //let userID = "userID placeholder"
SavedUserRecipesModel.find({ usersSaved: { $in: [userID] } })                                      //find by userID
.then(data => {
if (data.length > 0) {
console.log(data)           //should probably not return all data in final

res.json(data)
} else {
res.status(404).json({ message: "Server Error: failed to retrieve recipe.", error })
}
})
.catch(error => res.status(500).json({ message: "Server Error: Failed to retrieve saved recipes.", error }
))

})


//PUT FOR SAVEDMEALS
app.put('/mealgenie/savedrecipes', (req, res) => {              // adds users id to usersSaved Array
let recipeID = req.body.recipeID;            //recipe id to add userID
let userID = req.body.userID;                     //assigns userID to users id

SavedUserRecipesModel.findOneAndUpdate({ id: { $in: [recipeID] } }, { $push: { usersSaved: userID } })      //updates usersSaved for recipeID, pushes userID
.then(data => {
console.log(`PUT: ${data}`)
res.json(data)
})
.catch(error => res.status(500).json({ message: "Server Error: Failed to PUT", error }
)) 



/*
SavedUserRecipesModel.find({ recipeID: { $in: [requestedID] }})     //finds the recipe by recipeID
.then(recipe => {
console.log(recipe[0])
recipe[0].usersSaved.push(userID)      //pushes the userID to the recipe.usersSaved
recipe[0].save()                                           //saves to db
.then(updatedRecipe => {
res.json(updatedRecipe)                             //responds with updated recipe
})
.catch(error => res.status(500).json({ message: "Server Error: failed to save recipe. 1", error }
))
})
.catch(error => res.status(500).json({ message: "Server Error: failed to save recipe. 2", error }
))
*/
})

//DELETE FOR SAVEDMEALS
app.delete('/mealgenie/savedrecipes', (req, res) => {           //delete recipes when usersSaved = 0
let userID = req.body.userID;
console.log(userID)
let recipeID = req.body.recipeID;
console.log(recipeID)

SavedUserRecipesModel.findOneAndUpdate({ id: { $in: [recipeID] } }, { $pull: { usersSaved: { $in: [userID] } } })      //updates usersSaved for recipeID, pulls userID
.then(data => {
console.log(data)
console.log(`DELETE: ${data}`)
res.json(data)
})
.catch(error => res.status(500).json({ message: "Server Error: Failed to DELETE", error }
)) 

/*
SavedUserRecipesModel.findOneAndUpdate({ recipeID: { $in: [requestedIDToDelete] } }, { $pull: { "usersSaved": userID } })   //finds saved recipe based on userID
.then(data => {
SavedUserRecipesModel.find({ recipeID: { $in: [requestedIDToDelete] } })                                      //find by userID
.then(data => {
//for some reason data is returned in an array??
//TESTS -=-=-=-=-=-=-=-=-=-=-=-=-
// console.log(data[0])
// console.log("data step 2")
// console.log(data[0].usersSaved)
// console.log(data[0].recipeID)
if (data[0].usersSaved.length == 0) {  //check if 0 users saved after the update
console.log(data)
SavedUserRecipesModel.deleteOne({ recipeID: requestedIDToDelete })         //DELETES
.then(result => res.json(result))
.catch(error => res.status(500).json({ message: "Server Error: failed to delete items", error }))
} else {        //if not do nothing
//res.status(404).json({ message: "Server Error: failed to retrieve recipe.", error })
console.log("usersSaved > 0, not deleting")
res.json(data)
}
})
.catch(error => res.status(500).json({ message: "Server Error: Failed to retrieve saved recipes. FAIL STEP 2", error }
))
})
.catch(error => res.status(500).json({ message: "Server Error: Failed to find user in recipe. FAIL STEP 1", error }
))

*/
})

//TO DO
//TEST
//Add functionality for removing user from usersSaved

/*
1: finish delete
2: finish put
3: test put and delete
4: start making button components for save
5: link button components and pass appropriate data
6: saved meals page formatting
7: display saved meals
8: plug in userID input
9: test userID input



*/



//END SAVED MEALS FOR DATABASE
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

//listener
app.listen(PORT, function () {
    console.log(`MealGenie Server running on port: ${PORT}\n`)
})


//Any questions or concerns, please let me know! -DM

