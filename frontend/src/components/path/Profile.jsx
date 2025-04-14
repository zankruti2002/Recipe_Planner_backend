import React, { useContext, useState } from 'react'
import Nav from '../Nav'
import Library from '../Library'
import { AuthContext } from '../../auth/authSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Profile() {
    const {user, updateUser,logout} = useContext(AuthContext); 
    console.log(user);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name:user.name,
        email: user.email,
    });
    const [isUserUpdated,setIsUserUpdated] = useState(false)
    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };
    
    const deleteUser = async()=>{
        const isConfirmed = confirm("Are you sure you want to delete your Account?");
        if (isConfirmed) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log(user._id);
            const response = await axios.delete(`http://localhost:8000/users/delete/${user._id}`);
            console.log(response);
            logout()
            navigate('/');
            
        } else {
            console.log("Account not deleted.");
        }
    }
        
        
      const onSubmit = async (e) => {
        e.preventDefault();
       
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const response = await axios.put(`http://localhost:8000/users/update/${user._id}`, formData);
            console.log(response);
            if(response.statusText === "OK"){
                setIsUserUpdated(true)
                updateUser(response.data.updateUser);
            }
            console.log(response.data);
        } catch (error) {
            // Handle error response here (e.g., show an error message)
            setIsUserUpdated(false)

            console.error(error);
        }

      };
    return (

        <>
        <div className='dashboard'>
            <Nav />
            <div className='main'>
                <Library/>
                <div className='profileForm'>
                <form onSubmit={onSubmit}>
                    <input type='text' value={formData.name} onChange={onChange} name='name'/>
                    <input type='text' value={formData.email} onChange={onChange} name='email'/>
                    <button>Edit</button>
                </form>
                    <div className='deleteUserDiv'><button  onClick={deleteUser}>Delete Account</button></div>
                </div>
                {isUserUpdated? <p>the user info updated successfully</p>:<p>the user info does not updated</p>}
            </div>
        
        </div>
        </>
    )
}

export default Profile  