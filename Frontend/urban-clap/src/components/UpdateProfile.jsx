import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Camera, Eye, EyeOff, Check, Bell } from 'lucide-react';
import ProfileDropDown from './ProfileDropDown';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UpdateProfile = () => {
  const navigate=useNavigate();
  const{user:loginuser}=useAuth();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [currentUser] = useState({
    firstName: loginuser.firstName,
    lastName: loginuser.lastName,
    email: loginuser.email,
    phone:  loginuser.phone,
    profileImage: loginuser.profileImage
  });

  useEffect(() => {
    // Auto-fill with current user data
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      password: ''
    });
    setImagePreview(currentUser.profileImage);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("UPLOADED FILE:",file);
    if (file) {

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await axiosInstance.get("/api/auth/updateprofile-otp")

      console.log(res);
      if(res.data.status === 200) {
       navigate("/updation-otp", {
          state: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            phone:formData.phone,
            profileImage:profileImage
          },
        });
      } else if(res.data.status===300) {
         alert("Email does not registerd with Domestic-Gap");
      }
      
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
    
    {loginuser ?
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with Profile */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl relative overflow-hidden rounded-b-[60px] rounded-bl-[40px] rounded-br-[40px]"
      >
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 ">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.h1 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-black "
              >
                Update Your Profile
              </motion.h1>
              <motion.p 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className=" text-black text-lg"
              >
                Manage your personal information
              </motion.p>
            </div>
            <div className="flex items-center gap-4">
              
              
              <div className="relative -top-10 z-50">
                <ProfileDropDown />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-black p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-xl bg-gradient-to-br from-green-400 to-emerald-500"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {formData.firstName.charAt(0)}
                    </div>
                  )}
                </motion.div>
               <div
  type="button"
  onClick={() => fileInputRef.current?.click()}
  className="
    absolute bottom-0 right-0
    bg-black text-white
    w-10 h-10
    flex items-center justify-center
    rounded-full
    shadow-lg
  
    z-50
  "
>
  <Camera className="w-4 h-4" />
</div>


                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-gray-600 mt-4 text-center">Click the camera icon to update your profile picture</p>
            </motion.div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                  placeholder="First Name"
                  required
                />
              </motion.div>

              {/* Last Name */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                  placeholder="Last Name"
                />
              </motion.div>

              {/* Email */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                 type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                  placeholder="New Password"
                  
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              </motion.div>

              {/* Phone */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                  placeholder="Phone Number"
                />
              </motion.div>
            </div>

            {/* Password */}
            

            {/* Submit Button */}
           <motion.button
  type="submit"
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.9, duration: 0.5 }}
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
>
  Update Profile
</motion.button>

          </form>
        </motion.div>
      </div>
    </div>
        :<div>
          <button
          type='submit'
          className='
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          font-bold
          rounded-lg
          transition-all
          shadow-md
          hover:shadow-lg
          '
          >
            Login
          </button>
          </div>}
        </>
  );
};

export default UpdateProfile;