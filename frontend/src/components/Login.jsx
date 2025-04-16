import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  {AuthContext}  from '../auth/authSlice'
import axios from 'axios';
import Aside from './Aside';

function Login() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Check if the user is already logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate('/Dashboard');
        }
    }, [navigate]); // Dependency on navigate

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post('https://recipe-planner-ftl0.onrender.com/users/login', formData);
            const data = response.data;

            if (data && data.token) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                login(data); // Assuming your login context will set the user data
                navigate('/Dashboard');
            } else {
                alert("This User doesn't exist");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please try again.');
        }
    };  

    return (
    <>
        <Aside />

        <div className='Forms'>
        
        <form className='loginForm' onSubmit={onSubmit}>
        <h3>Login to Your Account</h3>
            <input type='email' placeholder='Enter your Email' name="email" onChange={onChange}/>
            <input type='password' placeholder='Enter your Password' name="password" onChange={onChange}/>
            <button className='loginBtn'>Login</button>
        </form>
        <p className='registerLink'>
          Haven't signed up yet? 
            <Link to="/Register"><div>Create an account</div></Link>
          and start your cooking journey today!
        </p>
        </div>
    </>
  )
}

export default Login