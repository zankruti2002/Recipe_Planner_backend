const Recipe = require('../models/recipeModel');

// Fetch all recipes with pagination and sorting
const fetchAllRecipe = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const [recipes, total] = await Promise.all([
            Recipe.find()
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Recipe.countDocuments()
        ]);

        res.status(200).json({ 
            success: true, 
            recipes,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch recipes', error: error.message });
    }
};

// Fetch a recipe by its ID
const fetchRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        res.status(200).json({ success: true, recipe });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch recipe', error: error.message });
    }
};

// Fetch recipes by ingredient name
const fetchRecipeByIngredient = async (req, res) => {
    try {
        const ingredientName = req.query.ingredient; 
        if (!ingredientName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ingredient name is required' 
            });
        }

        // Search in ingredients array for matching name
        const recipes = await Recipe.find({
            'ingredients.name': { $regex: ingredientName, $options: 'i' }
        });

        if (!recipes.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No recipes found with that ingredient' 
            });
        }

        res.status(200).json({ 
            success: true, 
            recipes: recipes 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch recipes', 
            error: error.message 
        });
    }
};

// Fetch recipes by recipe name
const fetchRecipeByName = async (req, res) => {
    try {
        const recipeName = req.query.name; 
        if (!recipeName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Recipe name is required' 
            });
        }

        // Use case-insensitive partial match for recipe name
        const recipes = await Recipe.find({
            name: { $regex: recipeName, $options: 'i' }
        });

        if (!recipes.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No recipes found with that name' 
            });
        }

        res.status(200).json({ 
            success: true, 
            recipes: recipes 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch recipes', 
            error: error.message 
        });
    }
};

// Advanced search for recipes
const searchRecipes = async (req, res) => {
    try {
        const { 
            name, 
            ingredients, 
            category, 
            cuisine,
            minIngredients,
            maxIngredients,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build search query
        const query = {};

        // Name search (case-insensitive partial match)
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Ingredient search (case-insensitive partial match)
        if (ingredients) {
            const ingredientList = ingredients.split(',').map(ing => ing.trim());
            query['ingredients.name'] = { 
                $in: ingredientList.map(ing => new RegExp(ing, 'i'))
            };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Cuisine filter
        if (cuisine) {
            query.cuisine = { $regex: cuisine, $options: 'i' };
        }

        // Number of ingredients range
        if (minIngredients || maxIngredients) {
            query.$expr = {};
            if (minIngredients) {
                query.$expr.$gte = [{ $size: '$ingredients' }, parseInt(minIngredients)];
            }
            if (maxIngredients) {
                query.$expr.$lte = [{ $size: '$ingredients' }, parseInt(maxIngredients)];
            }
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute search with pagination and sorting
        const [recipes, total] = await Promise.all([
            Recipe.find(query)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Recipe.countDocuments(query)
        ]);

        // Prepare response
        const response = {
            success: true,
            recipes,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        };

        if (!recipes.length) {
            return res.status(200).json({
                ...response,
                message: 'No recipes found matching your criteria'
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search recipes', 
            error: error.message 
        });
    }
};

// Create a new recipe
const createRecipe = async (req, res) => {
    try {
        const { name, description, instruction, imageURL, videoURL, cuisine, category, ingredients } = req.body;
        
        // Validate required fields
        if (!name || !category || !ingredients || ingredients.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, category, and at least one ingredient are required' 
            });
        }

        // Process videoURL to ensure it's a valid YouTube URL
        let processedVideoURL = videoURL;
        if (videoURL) {
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = videoURL.match(youtubeRegex);
            if (match) {
                processedVideoURL = `https://www.youtube.com/embed/${match[1]}`;
            }
        }

        const newRecipe = await Recipe.create({
            name,
            description,
            instruction,
            imageURL,
            videoURL: processedVideoURL,
            cuisine,
            category,
            ingredients
        });

        res.status(201).json({ 
            success: true, 
            message: 'Recipe created successfully',
            recipe: newRecipe 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create recipe', 
            error: error.message 
        });
    }
};

module.exports = {
    fetchAllRecipe,
    fetchRecipeById,
    fetchRecipeByIngredient,
    fetchRecipeByName,
    searchRecipes,
    createRecipe
};
