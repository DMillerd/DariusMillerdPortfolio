const mongoose = require('mongoose');   //require mongoose


const bucketListItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, "Description is required"],       //validators
        minLength: 3,
        maxLength: 100
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ItemsModel = mongoose.model('items', bucketListItemSchema)

module.exports = ItemsModel;

