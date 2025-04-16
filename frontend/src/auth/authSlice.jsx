import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Define the state that will be shared across the app
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = (userData) => {
    
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token); // Assuming userData contains a 'token' field
      setUser(userData);
      
  };

  const logout = () => {
     // Clear the user and token from local storage
     localStorage.removeItem('user');
     localStorage.removeItem('token');
     setUser(null);

  };

  const updateUser =(userData)=>{
    localStorage.setItem('user', JSON.stringify(userData));
  
    setUser(userData);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
