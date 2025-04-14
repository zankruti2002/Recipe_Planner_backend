const express = require('express');
const router = express.Router();

const recipe = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', recipe.fetchAllRecipe);
router.get('/search', recipe.searchRecipes);
router.get('/:id', recipe.fetchRecipeById);

// Protected routes
router.post('/', protect, recipe.createRecipe);

module.exports = router;