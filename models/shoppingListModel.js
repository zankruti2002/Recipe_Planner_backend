const mongoose = require('mongoose');

const shoppingListSchema = mongoose.Schema({
    name: {
        type:String,
        require: true
    },
    quantity:{
        type:Number,
        min:1,
        default:1
    },
    category: {
        type: String,
        enum: ['Fruits','Grain' ,'Vegetables', 'Dairy', 'Chicken', 'Beverages', 'Snacks', 'Frozen', 'Pantry', 'Beef','Fish','Seafood','Desserts','Spices','Dressing','Oils','Herbs','Condiments'],
    },
    unit:{
        type:String,
        enum: ['kg', 'g', 'lb', 'oz', 'L', 'ml', 'pcs', 'pack','bottle','bunch'],
        default: 'pcs'
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    }

},
{
    timestamps:true
})

const ShoppingList = mongoose.model('ShoppingList',shoppingListSchema);

module.exports = ShoppingList;