import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaYoutube, FaImage, FaUtensils, FaList, FaBook } from 'react-icons/fa';

const RecipeForm = () => {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: '',
        description: '',
        instruction: '',
        imageURL: '',
        videoURL: '',
        cuisine: '',
        category: '',
        ingredients: [{ name: '', quantity: '', category: '', unit: 'Pcs' }]
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewVideo, setPreviewVideo] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleVideoURLChange = (e) => {
        const url = e.target.value;
        setRecipe(prev => ({ ...prev, videoURL: url }));
        
        // Extract video ID from various YouTube URL formats
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        
        if (match) {
            const videoId = match[1];
            setPreviewVideo(`https://www.youtube.com/embed/${videoId}`);
        } else {
            setPreviewVideo('');
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[index][field] = value;
        setRecipe(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const addIngredient = () => {
        setRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '', category: '', unit: 'Pcs' }]
        }));
    };

    const removeIngredient = (index) => {
        if (recipe.ingredients.length > 1) {
            setRecipe(prev => ({
                ...prev,
                ingredients: prev.ingredients.filter((_, i) => i !== index)
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!recipe.name) newErrors.name = 'Recipe name is required';
        if (!recipe.category) newErrors.category = 'Category is required';
        if (!recipe.instruction) newErrors.instruction = 'Instructions are required';
        if (recipe.ingredients.some(ing => !ing.name || !ing.quantity || !ing.category)) {
            newErrors.ingredients = 'All ingredient fields are required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to create a recipe');
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:8000/recipes', recipe, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                alert('Recipe created successfully!');
                navigate('/Dashboard/recipes');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Please log in to create a recipe');
                    navigate('/login');
                } else {
                    alert('Failed to create recipe. Please try again.');
                }
            } else {
                alert('Network error. Please check your connection and try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="recipe-form-container">
            <div className="recipe-form-header">
                <h2>Create New Recipe</h2>
                <p>Fill in the details to add a new recipe to your collection</p>
            </div>

            <form onSubmit={handleSubmit} className="recipe-form">
                <div className="form-section">
                    <div className="section-header">
                        <FaUtensils className="section-icon" />
                        <h3>Basic Information</h3>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Recipe Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={recipe.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'error' : ''}
                                placeholder="Enter recipe name"
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={recipe.category}
                                onChange={handleInputChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Select a category</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Appetizers">Appetizers</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Salads">Salads</option>
                                <option value="Soups">Soups</option>
                                <option value="Seafood">Seafood</option>
                                <option value="Baking">Baking</option>
                            </select>
                            {errors.category && <span className="error-message">{errors.category}</span>}
                        </div>

                        <div className="form-group">
                            <label>Cuisine</label>
                            <input
                                type="text"
                                name="cuisine"
                                value={recipe.cuisine}
                                onChange={handleInputChange}
                                placeholder="e.g., Italian, Chinese, Indian"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <FaImage className="section-icon" />
                        <h3>Media</h3>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Image URL</label>
                            <div className="input-with-icon">
                                <input
                                    type="url"
                                    name="imageURL"
                                    value={recipe.imageURL}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            {recipe.imageURL && (
                                <div className="image-preview">
                                    <img src={recipe.imageURL} alt="Recipe preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>YouTube Video URL</label>
                            <div className="youtube-input">
                                <FaYoutube className="youtube-icon" />
                                <input
                                    type="url"
                                    name="videoURL"
                                    value={recipe.videoURL}
                                    onChange={handleVideoURLChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            {previewVideo && (
                                <div className="video-preview">
                                    <iframe
                                        src={previewVideo}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <FaBook className="section-icon" />
                        <h3>Description & Instructions</h3>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={recipe.description}
                            onChange={handleInputChange}
                            placeholder="Describe your recipe..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Instructions *</label>
                        <textarea
                            name="instruction"
                            value={recipe.instruction}
                            onChange={handleInputChange}
                            className={errors.instruction ? 'error' : ''}
                            placeholder="Step by step instructions..."
                            rows="5"
                        />
                        {errors.instruction && <span className="error-message">{errors.instruction}</span>}
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <FaList className="section-icon" />
                        <h3>Ingredients</h3>
                    </div>
                    <div className="ingredients-header">
                        <button type="button" className="add-ingredient-btn" onClick={addIngredient}>
                            <FaPlus /> Add Ingredient
                        </button>
                    </div>
                    {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
                    
                    <div className="ingredients-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <div className="ingredient-grid">
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                            placeholder="Ingredient name"
                                            className={!ingredient.name && errors.ingredients ? 'error' : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity *</label>
                                        <input
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                            placeholder="Amount"
                                            className={!ingredient.quantity && errors.ingredients ? 'error' : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={ingredient.category}
                                            onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                                            className={!ingredient.category && errors.ingredients ? 'error' : ''}
                                        >
                                            <option value="">Select category</option>
                                            <option value="Fruits">Fruits</option>
                                            <option value="Grain">Grain</option>
                                            <option value="Vegetables">Vegetables</option>
                                            <option value="Dairy">Dairy</option>
                                            <option value="Chicken">Chicken</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Snacks">Snacks</option>
                                            <option value="Frozen">Frozen</option>
                                            <option value="Pantry">Pantry</option>
                                            <option value="Beef">Beef</option>
                                            <option value="Fish">Fish</option>
                                            <option value="Seafood">Seafood</option>
                                            <option value="Dressing">Dressing</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <select
                                            value={ingredient.unit}
                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        >
                                            <option value="Cups">Cups</option>
                                            <option value="Tbsp">Tbsp</option>
                                            <option value="Tsp">Tsp</option>
                                            <option value="Pcs">Pcs</option>
                                        </select>
                                    </div>
                                </div>
                                {recipe.ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-ingredient-btn"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/Dashboard/recipes')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm; 