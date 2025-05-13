const mongoose = require('mongoose');

//Schema 'blueprint'
const userDataSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: [true, "User ID required"],
        default: Date.now()
    },
    // List of recipe IDs for recipes saved by user
    savedRecipes: {
        type: Array,
        required: false,
        default: []
    },
    // User recipe preferences
    userPreferences: {
        cuisines: {
            type: Array,    
            required: false,
            default: []
        },
        intolerances: {
            type: Array,    
            required: false,
            default: []
        },
        dietaryRestrictions: {
            type: Array,    
            required: false,
            default: []
        },
        protein: {
            type: Number,
            required: false,
            default: null
        },
        prepTime: {
            type: Number,
            required: false,
            default: null
        },
        mealTypes: {
            type: Array,
            required: false,
            default: []
        }
    }
});

//Compile Schema into model
const UserDataModel = mongoose.model('userData', userDataSchema);

module.exports = UserDataModel;