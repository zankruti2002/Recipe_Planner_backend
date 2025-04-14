const express = require('express');
const router = express.Router();

const shoppingListController = require('../controllers/shoppingListController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.get('/', protect, shoppingListController.fetchAllItems);
router.post('/', protect, shoppingListController.createNewItem);
router.put('/:id', protect, shoppingListController.updateItem);
router.delete('/:id', protect, shoppingListController.deleteItem);
router.delete('/', protect, shoppingListController.deleteAllItems);

module.exports = router;