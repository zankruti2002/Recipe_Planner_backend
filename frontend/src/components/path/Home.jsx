import React, { useEffect, useState, useContext } from 'react'
import Nav from '../Nav'
import Library from '../Library'
import {  useNavigate} from 'react-router-dom'
import { AuthContext } from '../../auth/authSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';


import '../../App.css'
function Home() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [allRecipes, setAllRecipes]=useState([])
    
    const fetchAllRecipes=async()=>{
        // 1.Make Request to DB
        const response = await axios.get("http://localhost:8000/recipes/");
        const data = await response.data;
        
        await setAllRecipes(data.recipes);
        console.log("Noted Fetched from DB");
        console.log("State Available: NOTES[{}]");
    }
    
    useEffect(() => {

        if (!user) {
        navigate('/');
        }
        fetchAllRecipes();
    }, []);
    
    const Save =async(recipe) =>{
        const savedData = {
            name:recipe.name,
            recipeId: recipe._id,
        }
        const token = localStorage.getItem("token");
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post("http://localhost:8000/savedRecipe/",savedData);
        
        console.log(response);
    }
 return (
    <>
        <div className='dashboard'>
            <Nav />
            <div className='main'>
                <Library/>
                <main>
                    <h2>All Recipes</h2>
                    <div className='allRecipes'>
                    {allRecipes && allRecipes.length > 0 ? (allRecipes.map((recipe) => (
                        <div key={recipe._id}>
                        <Link to={`/Dashboard/recipes/${recipe._id}`}>
                            <div className='rec'>
                                <div className='recipeName'> <h5>{recipe.name}</h5> <h6>{recipe.cuisine}</h6></div>
                                
                                <img src={recipe.imageURL} width='200px' height='160px'/>
                                
                            </div>
                        </Link>
                        <div className='saveRecipeBtn'><button className='saveRecipe'  onClick={()=>Save(recipe)}>Save</button></div>
                        </div>
                    ))):(
                       <h2>Loading ...</h2>
                    )}
                    </div>
                </main>
            </div>  
        </div>
    </>
  )
}

export default Home