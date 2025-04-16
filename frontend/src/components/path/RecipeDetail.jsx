import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../auth/authSlice';
import Nav from '../Nav';
import Library from '../Library';

function RecipeDetail() {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState({});
    const [isItemAvailable, setIsAvailable] = useState(false);
    const token = localStorage.getItem("token");

    const fetchRecipe = async () => {
        try {
            // 1. Make request to DB
            const response = await axios.get(`https://recipe-planner-ftl0.onrender.com/recipes/${recipeId}`);
            const data = await response.data;
            setRecipe(data.recipe);
            console.log("Recipe Fetched from DB");
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return; // Stop execution if user is not authenticated
        }
        fetchRecipe();
    }, [user, recipeId]);

    const savedData = {
        name: recipe.name,
        recipeId: recipeId,
    };

    const Save = async () => {
        try {
            const response = await axios.post("https://recipe-planner-ftl0.onrender.com/savedRecipe/", savedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    const addShopList = async (ingredient) => {
        const unit = convertUnits(ingredient.category);

        const ingredientData = {
            name: ingredient.name,
            quantity: 1,
            category: ingredient.category,
            unit: unit,
        };

        try {
            const response = await axios.post("https://recipe-planner-ftl0.onrender.com/shoppingList/", ingredientData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.statusText === "OK") {
                alert("Your item is now in the shopping list");
            }
        } catch (error) {
            console.error("Error adding ingredient to shopping list:", error);
        }
    };

    function convertUnits(category) {
        switch (category) {
            case 'Fruits':
            case 'Grain':
            case 'Vegetables':
            case 'Chicken':
            case 'Beef':
            case 'Fish':
            case 'Seafood':
                return "kg";
            case 'Dairy':
            case 'Snacks':
            case 'Frozen':
            case 'Desserts':
            case 'Spices':
            case 'Pantry':
                return "pack";
            case 'Beverages':
                return "L";
            case 'Herbs':
                return "bunch";
            case 'Oils':
            case 'Dressing':
                return "bottle";
            default:
                return "pcs";
        }
    }

    // Fixing isAvailable function to use ingredient._id
    const isAvailable = async (ingredientId) => {
        try {
            const response = await axios.get(`https://recipe-planner-ftl0.onrender.com/myKitchen/${ingredientId}`);
            if (response.statusText === "OK") {
                setIsAvailable(true); // Mark as available
            } else {
                setIsAvailable(false); // Mark as unavailable
            }
        } catch (error) {
            console.error("Error checking availability:", error);
            setIsAvailable(false); // Mark as unavailable on error
        }
    };

    return (
        <>
            <div className='dashboard'>
                <Nav />
                <div className='main'>
                    <Library />
                    <main className='recipeDetails'>
                        <div className='videoDiv'>
                            {recipe.videoURL && (
                                <iframe
                                    width="560"
                                    height="315"
                                    src={recipe.videoURL}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                        <div className='details'>
                            <p><strong>Description:</strong>{recipe.description}</p>
                            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                            <p><strong>Category:</strong> {recipe.category}</p>
                            <p><strong>Ingredients:</strong></p>
                            {recipe.ingredients ? (
                                recipe.ingredients.map((ingredient, index) => (
                                    <div key={index}>
                                        <div className='ingredient'>
                                            <p>{ingredient.name}: {ingredient.quantity} {ingredient.unit}</p>
                                            {/* Call isAvailable when clicking on ingredient */}
                                            <button
                                                className='checkAvailability'
                                                onClick={() => isAvailable(ingredient._id)} // Pass ingredient._id to check availability
                                            >
                                                Check Availability
                                            </button>
                                            {isItemAvailable && <p>Item is available in your kitchen!</p>}
                                            <button className='addShopList' onClick={() => addShopList(ingredient)}>
                                                Add to Shopping List
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No ingredients available</p>
                            )}
                            <strong>Instructions</strong>
                            <p>{recipe.instruction}</p>
                            <button className='saveRecipe' onClick={Save}>Save</button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default RecipeDetail;
