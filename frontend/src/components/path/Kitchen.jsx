import React, { useContext, useState, useEffect } from 'react'
import Nav from '../Nav'
import Library from '../Library'
import {AuthContext} from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Kitchen() {
    const [kitchenItems, setKitchenItems] = useState([]);

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const fetchShoppingList=async()=>{
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get("http://localhost:8000/myKitchen/");
        const data = await response.data;
        console.log(data.allItems);

        await setKitchenItems(data.allItems);
        
    }
    async function deleteItem (id){
     
        
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.delete(`http://localhost:8000/myKitchen/${id}`);
      console.log(response);
      setKitchenItems(kitchenItems.filter(kitchenItems => kitchenItems._id !== id));
  
      
    }
    const deleteAllList = async()=>{
      const isConfirmed = confirm("Are you sure you want to delete All the List?");
      if (isConfirmed) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.delete(`http://localhost:8000/myKitchen/`);
      setKitchenItems([])
      }else{
          console.log("List not deleted.");
      }
  }
    useEffect(() => {

        if (!user) {
        navigate('/');
        }
        fetchShoppingList()
    }, []);
    return (
    <>
    <div className='dashboard'>
        <Nav />
        <div className='main'>
            <Library/>
            <main>
                    <h2>My Kitchen</h2>
                    <div className='allRecipes'>
                    <div className='tableSection'>
                    <table>
                        <tr>
                            <th>item</th>
                            <th>category</th>
                            <th>quantity</th>
                            <th>unit</th>
                        </tr>
                    {kitchenItems.map((item) => (
                        <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                        <td className='saveRecipeBtn'><button className='saveRecipe' onClick={()=>deleteItem(item._id)}>Delete</button></td>
                        
                        </tr>

                    ))}
                    </table>
                    <button onClick={deleteAllList} className='delete'>Delete All List</button>
                    </div>
                    </div>
                </main>
        </div>
       
    </div>
</>
   
  )
}

export default Kitchen