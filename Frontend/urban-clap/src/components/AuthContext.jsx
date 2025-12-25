import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchUser = async () => {
    try {
        console.log(document.cookie);
      const res = await axiosInstance.get("/api/auth/me");
            console.log("Fetched user:", res.data.data.user);


      setUser(res.data.data.user);
    } catch (err) {
              console.error("Auth check failed:", err);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  
  // cleanup to avoid memory leaks
  fetchUser()
}, []);


  return (
    <AuthContext.Provider value={{ user,setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom Hook
export const useAuth = () => useContext(AuthContext);
