const express = require('express');
const router = express.Router();

const savedRecipes = require('../controllers/savedRecipeContoller');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.get('/', protect, savedRecipes.fetchAllSavedRecipes);
router.get('/:id', protect, savedRecipes.fetchRecipeById);
router.post('/', protect, savedRecipes.createNewRecipe);
router.delete('/:id', protect, savedRecipes.deleteRecipe);

module.exports = router;