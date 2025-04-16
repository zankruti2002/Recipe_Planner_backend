import React, { useContext, useState, useEffect } from 'react'
import Nav from '../Nav'
import Library from '../Library'
import {AuthContext} from '../../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function ShoppingList() {
    const [shopList, setShopList] = useState([]);

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const fetchShoppingList=async()=>{
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get("https://recipe-planner-ftl0.onrender.com/shoppingList/");
        const data = await response.data;
        console.log(data.allItems);

        await setShopList(data.allItems);
        
    }
    async function deleteItem (id){
     
        
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.delete(`https://recipe-planner-ftl0.onrender.com/shoppingList/${id}`);
      console.log(response);
      setShopList(shopList.filter(shopList => shopList._id !== id));
  
      
    }
    const purshased =async(item)=>{
          
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`https://recipe-planner-ftl0.onrender.com/myKitchen/`,item);
      console.log(response.data);
      deleteItem(item._id)
    }

    const deleteAllList = async()=>{
        const isConfirmed = confirm("Are you sure you want to delete All the List?");
        if (isConfirmed) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.delete(`https://recipe-planner-ftl0.onrender.com/shoppingList/`);
        console.log(response.data);
        setShopList([])
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
                    <h2>Shopping List</h2>
                    <div className='allRecipes'>
                    <div className='tableSection'>
                    <table>
                        <tr>
                            <th>item</th>
                            <th>category</th>
                            <th>quantity</th>
                            <th>unit</th>
                            
                        </tr>
                    {shopList.map((item) => (
                        <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                        <td ><div className='control'><button className='delete' onClick={()=>deleteItem(item._id)}>Delete</button>
                        <button onClick={()=>{purshased(item)}}>Purchased</button></div></td>
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

export default ShoppingList