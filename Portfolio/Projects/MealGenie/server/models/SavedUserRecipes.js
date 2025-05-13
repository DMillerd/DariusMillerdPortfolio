const mongoose = require('mongoose');

//Schema 'blueprint'
const savedUserRecipeSchema = new mongoose.Schema({
      //'cache' recipe data in order to save api calls when on saved recipes page
    id: {
        type: Number,    
        required: false
    },
    title: {
        type: String,    
        required: false
    },
    image: {
        type: String,    
        required: false
    },
    summary: {
        type: String,    
        required: false
    },
    extendedIngredients: {
        type: Array,    
        required: false
    },
    analyzedInstructions: {
        type: Array,    
        required: false
    },
    usersSaved: {
        type: Array,    
        required: false
    }
    //can add more if necessary
});

//Compile Schema into model
const SavedUserRecipesModel = mongoose.model('savedrecipe', savedUserRecipeSchema);

module.exports = SavedUserRecipesModel;

