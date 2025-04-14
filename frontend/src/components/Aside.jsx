import React from 'react'
import  Pan  from '../assets/PanAnimation.png'
function Aside() {
  return (
    <>
        <div className='asideDiv'>
            <img src={Pan} className='pan'/>
            <h2>Welcome Back to Recipe Hub!</h2>
            <p >Explore thousands of delicious recipes curated by chefs and food enthusiasts from around the world.</p>
        </div>
    </>
  )
}

export default Aside