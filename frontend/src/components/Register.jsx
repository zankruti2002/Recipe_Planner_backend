import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  {AuthContext}  from '../auth/authSlice'
import axios from 'axios';
import Aside from './Aside';

function Register() {

    const { login } = useContext(AuthContext);
    const [regFormData, setRegFormData] = useState({
        name:'',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
      
    const onChange = (e) => {
        setRegFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
    };
    
      const onSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/users/register', regFormData)
        const data = await response.data;
        const token = await data.token;
        console.log(data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (data) {   
            login(data);
            navigate('/Dashboard');
        }
      };
    

  return (
    <>
    <div className='Forms'>
   
        <form className='loginForm' onSubmit={onSubmit}>
        <h3 >Create Your Account</h3>
            <input type="text" name="name" placeholder='Enter your Name' onChange={onChange}/>
            <input type='email' placeholder='Enter your Email' name="email" onChange={onChange}/>
            <input type='password' placeholder='Enter Password' name="password" onChange={onChange}/>

            <button className='loginBtn'>Sign Up</button>
        </form>
        <p>
        Already have an account?
            <Link to="/"><div>Log in here.</div></Link>
        </p>
        </div>
        <Aside />

    </>
  )
}

export default Register