import React, {useContext} from 'react'
import '../App.css'
import cookingPot from '../assets/cookingPot.png'
import { AuthContext } from '../auth/authSlice';
import { Link } from 'react-router-dom';
function Nav() {
    const { user } = useContext(AuthContext);
  return (
    <>
    
      <div className='Header'>

        <div className='Logo-search'>
            <img src={cookingPot} className='logo'/>
            <form className='searchBar' >
                <input type='text' name='recipeName' placeholder='search by recipe name'/>
            </form>
        </div>


        <div className="dropdown">
            <h3 className="userName">{user.name} </h3>
            <div className="dropdown-content">
                <Link to="/profile" className='navigator'>Edit Profile</Link>
            </div>
        </div>
        
      </div>
      
    
    </>
  )
}

export default Nav