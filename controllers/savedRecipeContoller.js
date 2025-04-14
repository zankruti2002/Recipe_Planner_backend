const asyncHandler = require('express-async-handler');

const SavedRecipe = require('../models/savedRecipeModel');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

const fetchAllSavedRecipes = asyncHandler(async (req, res) => {
    const allRecipes = await SavedRecipe.find({ userId: req.user.id }).populate("recipeId");
    res.status(200).json({ allRecipes });
});

const fetchRecipeById = asyncHandler(async (req, res) => {
    const recipe = await SavedRecipe.findOne({ userId: req.user.id, _id: req.params.id });
    
    if (!recipe) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ recipe });
});

const createNewRecipe = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const recipeId = req.body.recipeId;
    
    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check if recipe is already saved by this user
    const existingSavedRecipe = await SavedRecipe.findOne({
        userId: req.user.id,
        recipeId: recipeId
    });

    if (existingSavedRecipe) {
        return res.status(400).json({ 
            success: false, 
            message: 'Recipe is already saved in your collection' 
        });
    }
    
    try {
        const newItem = await SavedRecipe.create({
            name: name,
            recipeId: recipeId,
            userId: req.user.id
        });
        res.status(200).json({ success: true, item: newItem });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

const deleteRecipe = asyncHandler(async (req, res) => {
    const savedRecipeId = req.params.id;

    try {
        const deletedSavedRecipe = await SavedRecipe.findByIdAndDelete(savedRecipeId);

        if (!deletedSavedRecipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = {
    fetchAllSavedRecipes,
    fetchRecipeById,
    createNewRecipe,
    deleteRecipe,
};
