import React,{useContext, useEffect} from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../auth/authSlice';

function Library() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const {logout} = useContext(AuthContext);

    
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const Logout=async ()=>{
        logout();
        navigate('/');
    }

    return (
        <>
            <aside className='sideDiv'>
                <div className='myLibrary'>
                    <Link to='/Dashboard/recipes' className='item'>Home</Link>
                    <Link to='/Dashboard/myrecipes' className='item'>My Recipes</Link>
                    <Link to='/Dashboard/shoppinglist' className='item'>Shopping List</Link>
                    <Link to='/Dashboard/mykitchen' className='item'>My Kitchen</Link>
                    <Link to='/Dashboard/add-recipe' className='item add-recipe-btn'>
                        <span className="plus-icon">+</span> Add New Recipe
                    </Link>
                </div>
                <div className='logout'>
                    <button className='logoutBtn delete' onClick={Logout}>Logout</button>
                </div>
            </aside>
        </>
    )
}

export default Library