import React, { useEffect, useState, useContext } from 'react'
import Nav from '../Nav'
import Library from '../Library'
import {  useNavigate} from 'react-router-dom'
import { AuthContext } from '../../auth/authSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Savedrecipes() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [savedRecipes, setSavedRecipes]=useState([])
    
    const fetchSavedRecipes=async()=>{
        // 1.Make Request to DB
        const token = localStorage.getItem("token");
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get("https://recipe-planner-ftl0.onrender.com/savedRecipe/");
        const data = await response.data;
        console.log(data.allRecipes);
        await setSavedRecipes(data.allRecipes);
        
    }
    async function deleteRecipe (id){
      const token = localStorage.getItem("token");
        
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.delete(`https://recipe-planner-ftl0.onrender.com/savedRecipe/${id}`);
      console.log(response.data);
      setSavedRecipes(savedRecipes.filter(savedRecipes => savedRecipes._id !== id));
  
      
    }
    useEffect(() => {

        if (!user) {
        navigate('/');
        }
        fetchSavedRecipes();
    }, []);
  return (
    <>
    <div className='dashboard'>
            <Nav />
            <div className='main'>
                <Library/>
                <main>
                    <h2>Saved Recipes</h2>
                    <div className='allRecipes'>
                    {savedRecipes.map((recipe) => (
                        <div key={recipe.recipeId._id}>
                        <Link to={`/Dashboard/recipes/${recipe.recipeId._id}`} >
                            <div className='rec'>
                                <div className='recipeName'> 
                                    <h5>{recipe.name}</h5> 
                                    <h6>{recipe.recipeId.cuisine}
                                    </h6>
                                </div>
                                
                                <img src={recipe.recipeId.imageURL} width='200px' height='160px'/>
                                
                            </div>
                        </Link>
                            <div className='saveRecipeBtn'><h4>{recipe.savedDate.split("T")[0]}</h4> <button className='saveRecipe' onClick={()=>deleteRecipe(recipe._id)}>Delete</button></div>
                        </div>

                    ))}
                    </div>
                </main>
            </div>
           
        </div>
</>

  )
}

export default Savedrecipes