const mongoose = require('mongoose');

//Schema 'blueprint'
const recipeSchema = new mongoose.Schema({

        //build schema here
        /*
        recipe storage items
        might not need a model for this if we are just pulling from apis but if we want to pull from multiple apis and consolidate info to an easier to access db, this is what we could store
            name
            author
            ingredients
            steps
            link to original
            images
            -- any more ideas add here

            API endpoints
            used API info 'cached' into database to save any unneeded API calls

        */
    recipeName: {
        type: String,
        required: [false, "Recipe name required"],       //validators, make true later
        minLength: 3,
        maxLength: 100
    },
    createdAt: {    //potential sorting parameter
        type: Date,
        default: Date.now
    },
    recipeData: {   //'cache' recipe data in order to save api calls when on saved recipes page
        recipeIngredients: {
            type: String,
            required: [false, "Recipe ingredients required"]    //make true later
        },
        recipeSteps: {
            type: String,
            required: [false, "Recipe steps required"]      //make true later
        },
        recipeImage: {
            type: String,
            required: [false, "Recipe image required"]      //make true
        },
        recipeLink: {
            type: String,
            required: [false, "Recipe link required"]
        }
    },
    isFavorited: {    //potential sorting parameter
        type: Boolean,
        default: false
    }
    //can add more if necessary
});

//Compile Schema into model
const RecipesModel = mongoose.model('recipe', recipeSchema);

module.exports = RecipesModel;


//title image steps and ingredients

//work on getting data from spoonacular, push into db
