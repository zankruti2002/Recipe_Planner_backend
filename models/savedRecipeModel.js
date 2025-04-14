const mongoose = require('mongoose');

const savedRecipeSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    recipeId:{
        type: mongoose.Types.ObjectId,
        ref:'Recipe'
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    savedDate:{
        type:Date,
        default: Date.now
    }
},
{
    timestamps:true
})

const savedRecipe = mongoose.model('SavedRecipe', savedRecipeSchema)

module.exports = savedRecipe;