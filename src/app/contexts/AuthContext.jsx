import { createContext, useContext, useState, useEffect } from 'react';

// crear contexto 
const AuthContext = createContext(undefined);

// crear provider
export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('user');
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const isAuthenticated = !!user && localStorage.getItem("token")


 useEffect(()=> {
  initAuth()
 }, [])

  const initAuth = async () => {
    try{
      const res = await fetch("http://localhost:5000/auth/refresh-token", {
        method:"POST",
        credentials:"include"
      });
      
      if(!res.ok) {
        return; 
      }
      
      const data = await res.json();
      setAccessToken(data.accessToken)
      setAuthReady(true)
    } catch(err){
      console.log("No session")
    } finally{
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name:name
      })
    })

    const data = await res.json()
    
    return data
  };

  const login = async (email, password) => {
    try{
      const res = await fetch("http://localhost:5000/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials: "include", // 🔥 CLAVE
        body:JSON.stringify({email, password})
      })
  
      const data = await res.json();
      
      if(data.user){
        setUser(data.user)
        localStorage.setItem("user",JSON.stringify(data.user))
        //localStorage.setItem("token",data.token)
        setAccessToken(data.token)
        setAuthReady(true)
      }

      return data
    } catch(error){
      if (error instanceof TypeError) {
        return {message:"Network Error: Could not connect to the server"}
      console.error("Network Error: Could not connect to the server.");
    } else {
      console.error("Error:", error.message);
    }
    }
  };

  const logout = async () => {
    const res = await fetch("http://localhost:5000/auth/logout", {
      method:"POST",
      credentials:"include"
    })
    const data = await res.json();
    console.log(data.message) 

    setUser(null);
    setAuthReady(false)
    setAccessToken(null)
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authReady,loading, user, login, register, logout, isAuthenticated, accessToken}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
