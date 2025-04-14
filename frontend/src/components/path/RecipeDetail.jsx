import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/authSlice';
import Nav from '../Nav';
import Library from '../Library';

function RecipeDetail() {
    const {recipeId} =useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe]=useState({});
    const [isItemAvailable, setIsAvailable]=useState(false);

    const token = localStorage.getItem("token");

    const fetchRecipe=async()=>{
        // 1.Make Request to DB
        const response = await axios.get("http://localhost:8000/recipes/"+recipeId);
        const data = await response.data;
        console.log(data.recipe.videoURL);
        await setRecipe(data.recipe);
        console.log("Recipe Fetched from DB");
        
    }
    
    useEffect(() => {

        if (!user) {
        navigate('/');
        }
        fetchRecipe();
        
    }, []);
    const savedData = {
        name:recipe.name,
        recipeId: recipeId,
        
    }
    
    const Save =async() =>{
        
        const response = await axios.post("http://localhost:8000/savedRecipe/",savedData);
        
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log(response);
    }
    const addShopList = async(ingredient)=>{
        console.log(ingredient);

        const unit = convertUnits(ingredient.category);
        
        const ingredientData = {
            name: ingredient.name,
            quantity: 1,
            category:ingredient.category,
            unit:unit
        }
        console.log(ingredientData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post("http://localhost:8000/shoppingList/",ingredientData);
        
        if(response.statusText==="OK"){
            alert("Your Item is now in the Shopping List");
        }
        
       

    }
    function convertUnits(category){
        let result;
        switch(category){
            case 'Fruits':result ="kg";
                         break;
            case 'Grain':result ="kg";
                         break;
            case 'Vegetables':result ="kg";
                         break;
            case 'Dairy':result ="pack";
                         break;    
            case 'Chicken':result ="kg";
                         break;
            case 'Beverages':result ="L";
                         break;
            case 'Snacks':result ="pack";
                         break;    
            case 'Frozen':result ="pack";
                         break;
            case 'Pantry':result ="pack";
                         break;
            case 'Beef':result ="kg";
                         break;   
            case 'Fish':result ="kg";
                         break;
            case 'Seafood':result ="kg";
                         break;
            case 'Desserts':result ="pack";
                         break;                                          
            case 'Spices':result ="pack";
                         break;
            case 'Dressing':result ="bottle";
                         break;
            case 'Oils':result ="bottle";
                         break;
            case 'Herbs':result ="bunch";
                         break;   
            default: result = "pcs";         
            }
        return result;
    }
    const isAvailable=async()=>{
        const response = await axios.get(`http://localhost:8000/myKitchen/${ingredient._id}`);
        if(response.statusText === "OK"){
            setIsAvailable(true);
        }
        else{
            setIsAvailable(false)
        }
    }
  return (

    <>
     <div className='dashboard'>
            <Nav />
            <div className='main'>
                <Library/>
                <main className='recipeDetails'>
                    <div className='videoDiv'>
                        <iframe width="560" height="315" src={recipe.videoURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                    <div className='details'>
                        <p><strong>Description:</strong>{recipe.description}</p>
                        
                        <p><strong>Cuisine</strong>:{recipe.cuisine}</p>
                        <p><strong>Category:</strong>{recipe.category}</p>
                        <p><strong>Ingredients</strong></p>
                        {
                            recipe && recipe.ingredients ? (

                                recipe.ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <div className='ingredient'><p>{ingredient.name}: {ingredient.quantity} {ingredient.unit} </p><button className='addShopList' onClick={()=>{addShopList(ingredient)}}>Add to ShoppingList</button></div>
                                    
                                </div>
                                ))
                                
                            ) : (
                                <p>No ingredients available</p> 
                            )
                        }
                        <strong>Instructions</strong>
                        <p>{recipe.instruction}</p>
                        <button className='saveRecipe' onClick={Save}>Save</button>
                    </div>
                </main>

            </div>
           
        </div>
       
    </>
  )
}

export default RecipeDetail