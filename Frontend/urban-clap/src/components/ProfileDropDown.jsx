import axios from "axios"
import {motion,AnimatePresence} from "framer-motion"
import { User, MapPin, Calendar, LogOut ,ShoppingCart,HelpCircle, Home,UserRoundPen} from "lucide-react"
import { useState,useEffect,useRef } from "react"
import { useNavigate } from "react-router-dom"
import  {useAuth} from "./AuthContext"
import axiosInstance from "../axiosInstance"
import { Profiler } from "react"

const ProfileDropDown=()=>{
const { user: loginUser,setUser } = useAuth();
 console.log("Login User in ProfileDropDown:", loginUser);
      const navigate=useNavigate();
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const profileRef=useRef(null);
      useEffect(()=>{
        const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
      },[isProfileOpen])

  const handlelogout=async ()=>{
    const res= await axiosInstance.get("/api/auth/logout")

    setUser(null);

    
    navigate("/login",{replace:true})

    alert("Logout Successfully")
  }
  
 const  user= {
    
    name: loginUser.firstName +loginUser.lastName,
    email: loginUser.email,
    image: null 
  };

 return <>
 <div className="fixed  right-6 z-100  " ref={profileRef}>
          
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.7,
                type: "spring",
                stiffness: 120,
                damping: 12,
                delay: 0.2
              }}
              className="hover:shadow-green "
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
             
              {loginUser.profileImage ? (
                <img 
                  src={loginUser.profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-green-600 p-0 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                  {loginUser.firstName.charAt(0)}
                </div>
              )}
            </motion.button>

            <AnimatePresence>
                {isProfileOpen && (
                  <>
                    
                    <div 
                      className="fixed  z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* User Info Section */}
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 border-b">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {loginUser.profileImage ? (
                            <img 
                              src={loginUser.profileImage} 
                              alt="Profile" 
                              className="w-12 sm:w-14 h-12 sm:h-14 rounded-full object-cover border-2 border-green-600"
                            />
                          ) : (
                            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                              { loginUser.firstName.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-black text-sm sm:text-base">{loginUser.firstName}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <MenuItem 
                          icon={<Home className="w-5 h-5" />}
                          label="Home"
                          onClick={() => {
                            if(loginUser.role==="provider"){
                              navigate("/provider"),{replace: true}
                            }else{
                              navigate("/home"),{replace: true}
                            }
                            
                            setIsProfileOpen(false);
                          }}
                        />
                        {
                          (loginUser.role==="provider")?
                           <MenuItem 
                          icon={<UserRoundPen className="w-5 h-5" />}
                          label="Complete Your Profile"
                          onClick={() => {
                            if(loginUser.role==="user"){
                              navigate("/bookings")
                            }else{
                              navigate("/provider/complete-profile")
                            }
                            
                            setIsProfileOpen(false);
                          }}
                        />
                          :null
                        }
                        <MenuItem 
                          icon={<User className="w-5 h-5" />}
                          label="Update Profile"
                          onClick={() => {
                            navigate("/updateProfile")
                            setIsProfileOpen(false);
                          }}
                        />
                        {
                          (loginUser.role==="user")?
                          <MenuItem 
                          icon={<MapPin className="w-5 h-5" />}
                          label="Manage Addresses"
                          onClick={() => {
                            navigate("/updateAddress")
                            setIsProfileOpen(false);
                          }}
                        />
                          :null

                        }
                        
                        
                        <MenuItem 
                          icon={<Calendar className="w-5 h-5" />}
                          label={loginUser.role==="user"?"My bookings":"My Jobs"}
                          onClick={() => {
                            if(loginUser.role==="user"){
                              navigate("/bookings")
                            }
                            else{
                              navigate("/provider/myjobs")
                            }
                            
                            setIsProfileOpen(false);
                          }}
                        />
                        {
                          (loginUser.role==="user")?
                          <MenuItem 
                          icon={<ShoppingCart className="w-5 h-5" />}
                          label="Past Orders"
                          onClick={() => {
                            navigate("/user/PostOrderPage")
                            setIsProfileOpen(false);
                          }}
                        />
                          : null
                        }
                        
                        
                       <MenuItem 
                          icon={<HelpCircle className="w-5 h-5" />}
                          label="Help & Support"
                          onClick={() => {
                            alert("We are Coming Soon for Your Help 😊")
                            scrollToSection('Bookings');
                            setIsProfileOpen(false);
                          }}
                        />
                        
                        
                        <div className="border-t my-2" />
                        
                        <MenuItem 
                          icon={<LogOut className="w-5 h-5" />}
                          label="Logout"
                         onClick={()=>handlelogout()

                        }
                          className="text-red-600 hover:bg-red-100"
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            

 </>
}
const MenuItem = ({ icon, label, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-left ${className}`}
    >
      <span className="text-gray-600 flex-shrink-0">{icon}</span>
      <span className="font-medium text-gray-800 text-sm sm:text-base">{label}</span>
    </button>
  );
};
export default ProfileDropDown;