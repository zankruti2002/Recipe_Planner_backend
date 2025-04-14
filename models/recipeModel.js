const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    instruction: String,
    imageURL: String,
    videoURL: String,
    cuisine: String,
    category: {
        type: String,
        enum: [
            'Breakfast',
            'Snacks',
            'Lunch',
            'Dinner',
            'Appetizers',
            'Desserts',
            'Beverages',
            'Salads',
            'Soups',
            'Seafood',
            'Baking',
            'Vegan',
            'Vegetarian',
            'Gluten-Free',
            'Low-Carb',
            'High-Protein',
            'Kids Special',
            'Quick & Easy',
            'Festive',
            'Street Food',
            'Side Dish',
            'Main Course',
            'Condiment',
            'Pickles',
            'Dips',
            'Grilling',
            'Slow Cooker',
            'Instant Pot',
            'No-Cook'
          ]          
    },
    ingredients: [{
        name: String,
        quantity: Number,
        category: {
            type: String,
            enum: [
                'Fruits',
                'Grain',
                'Vegetables',
                'Dairy',
                'Chicken',
                'Beef',
                'Fish',
                'Seafood',
                'Eggs',
                'Tofu',
                'Paneer',
                'Pulses',
                'Legumes',
                'Beverages',
                'Snacks',
                'Frozen',
                'Pantry',
                'Canned Goods',
                'Baking Supplies',
                'Sweeteners',
                'Flours',
                'Dressing',
                'Spices',
                'Sauces',
                'Condiments',
                'Condiment',
                'Oils',
                'Nuts',
                'Seeds',
                'Herbs',
                'Seasonings',
                'Vinegars',
                'Broth & Stock',
                'Pasta',
                'Rice',
                'Breakfast Items',
                'Meat Alternatives',
                'Ready-to-Eat',
                'Pickles',
                'Marinades',
                'Jams & Preserves',
                'Chocolates',
                'Syrups',
                'Miscellaneous'
              ]
              
        },
        unit: {
            type: String,
            enum: [
                'Cups', 'cups',
                'Tbsp', 'tbsp',
                'Tsp', 'tsp',
                'Pcs', 'pcs',
                'Grams', 'grams',
                'Kg', 'kg',
                'Litre', 'litre',
                'Ml', 'ml',
                'Oz', 'oz',
                'Lb', 'lb',
                'Pinch', 'pinch',
                'Clove', 'clove',
                'Slice', 'slice',
                'Can', 'can',
                'Dash', 'dash',
                'Drop', 'drop',
                'Stick', 'stick',
                'Bunch', 'bunch',
                'pieces','Pieces',
              ],
            default: 'Pcs'
        }
    }]
},
{
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
