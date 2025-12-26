import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Star,
  Shield,
  Clock,
  MapPin,
  Wallet,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Heart,
  Zap,
  Bell,
  Sparkles,
  Target,
} from "lucide-react";
import ProfileDropDown from "./ProfileDropDown";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance";
const Provider = () => {
  const navigate = useNavigate();
  const [isOnline,setIsOnline]=useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [todayEarnings, setTodayEarnings] = useState(0);
 const [activejobs,setActiveJobs]=useState(0);


  // ḤANDLE ALLOW LOCATION
const handleAllowLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timeout'));
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId);
          resolve(pos);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const res = await axiosInstance.post("/api/provider/create-profile", {
      lat,
      lng,
    });
    console.log(res);

  } catch (error) {
    console.error("Location error:", error);
    
    // Fallback to IP-based location
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      const res = await axiosInstance.post("/api/provider/create-profile", {
        lat: ipData.latitude,
        lng: ipData.longitude,
      });
      console.log('Used IP location:', res);
    } catch (ipError) {
      console.error("IP location also failed:", ipError);
      alert("Unable to get location. Please enable location permissions or enter manually.");
    }
  }
};

useEffect(() => {
  handleAllowLocation();
  
}, []);

// ← FIX: Empty array, not empty object
useEffect(() => {
  const timer = setTimeout(() => {
    const allowed = window.confirm(
      "Allow location access to get nearby jobs?"
    );

    if (allowed) {
      handleAllowLocation();
    }
  }, 10000);

  return () => clearTimeout(timer);
}, []);



useEffect(() => {
  const ActiveJobs = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/my-jobs");
      const totaljobs = res.data.data;
     const activeJobs= totaljobs.filter(job=>job.status==="pending");
     setActiveJobs(activeJobs.length)
      console.log("API Response FOR ACTIVE JOBS :", activeJobs);
    } catch (error) {
      console.error("Error fetching active jobs:", error);
    }
  };

  ActiveJobs();
}, []);



const toggleAvalability = async () => {
  try {
    setIsOnline(!isOnline);
     const res = await axiosInstance.post("/api/provider/avaliability",{
      isAvaliable:isOnline
    });
    
   
    console.log(res);
    setTodayEarnings(res.data.data.todayEarnings);
    if (res.data.success) {
      alert("Your avaliability is updated");
    }

  } catch (error) {
    console.error("Error toggling availability:", error);
    
  }
}
useEffect(() => {
  const fetchUser = async () => {
  
    try {
      
      // const res = await axiosInstance.get("/api/provider/available");
      //       console.log("Fetched user:", res.data.data.user);


      setUser(res.data.data.user);
    } catch (err) {
              console.error("Auth check failed:", err);

      setUser(null);
    } 
  };

  
  // cleanup to avoid memory leaks
  fetchUser()
}, []);




  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Guaranteed Earnings",
      description: "Earn ₹15,000 - ₹50,000 monthly with flexible working hours",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Job Security",
      description:
        "Verified customers, secure payments, and insurance coverage",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Schedule",
      description: "Work when you want, choose your own hours and locations",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Skill Development",
      description: "Free training programs and skill enhancement courses",
      color: "from-orange-500 to-red-600",
    },
  ];

  const services = [
    { name: "Home Cleaning", demand: "High", earning: "₹500-800/day" },
    { name: "Plumbing", demand: "Very High", earning: "₹800-1500/day" },
    { name: "Electrical Work", demand: "High", earning: "₹700-1200/day" },
    { name: "AC Repair", demand: "Medium", earning: "₹600-1000/day" },
    { name: "Painting", demand: "Medium", earning: "₹800-1500/day" },
    { name: "Carpentry", demand: "High", earning: "₹700-1300/day" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      service: "Plumber",
      rating: 4.9,
      earnings: "₹35,000/month",
      review:
        "Best platform for service providers. Regular work and timely payments!",
    },
    {
      name: "Priya Sharma",
      service: "House Cleaner",
      rating: 4.8,
      earnings: "₹25,000/month",
      review: "Flexible timing and respectful customers. Love working here!",
    },
    {
      name: "Amit Singh",
      service: "Electrician",
      rating: 4.9,
      earnings: "₹42,000/month",
      review: "Great support team and consistent income. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Enhanced Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)",
              "linear-gradient(135deg, #059669 0%, #047857 25%, #065f46 50%, #064e3b 75%, #10b981 100%)",
              "linear-gradient(135deg, #047857 0%, #065f46 25%, #064e3b 50%, #10b981 75%, #059669 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-20 w-32 h-32 border border-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-20 w-24 h-24 border border-white/15 rounded-full"
          />
        </div>

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 backdrop-blur-[1px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-between">
            {/* Left Section - Brand */}
            <div className="flex-1">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="flex items-center gap-4 mb-3"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h1
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white relative"
                >
                  Domestic-Gap
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="block text-lg sm:text-xl lg:text-2xl font-medium text-green-200 mt-1"
                  >
                    Provider Hub
                  </motion.span>
                </motion.h1>
              </motion.div>

              <motion.p
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-green-100 text-base sm:text-lg lg:text-xl font-medium flex items-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
                Your gateway to flexible earnings and job security
              </motion.p>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Stats Preview */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                className="hidden lg:flex items-center gap-4 xl:gap-6 bg-white/10 backdrop-blur-md rounded-2xl px-4 xl:px-6 py-3 border border-white/20"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl xl:text-2xl font-bold text-white"
                  >
                    50K+
                  </motion.div>
                  <div className="text-xs text-green-200">Providers</div>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-xl xl:text-2xl font-bold text-white"
                  >
                    4.8★
                  </motion.div>
                  <div className="text-xs text-green-200">Rating</div>
                </div>
              </motion.div>

              {/* Notification Bell */}
              
                {/* Ripple effect */}
                

              {/* Profile Dropdown */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
                className="relative z-50   mb-13 "
              >
                <ProfileDropDown />
              </motion.div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 gap-4 sm:gap-0"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-white font-medium cursor-pointer text-sm sm:text-base"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Active Jobs</span>
                <span className="sm:hidden">Jobs</span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold"
                >
                  {activejobs} New
                </motion.span>
              </motion.div>

              <div className="hidden sm:block w-px h-6 bg-white/30"></div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-white font-medium cursor-pointer text-sm sm:text-base"
              >
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Today's Earnings</span>
                <span className="sm:hidden">Earnings</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-yellow-300 font-bold"
                >
                ₹{
                todayEarnings
                }
                </motion.span>
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAvalability()}
              className={`px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 border text-sm sm:text-base w-full sm:w-auto justify-center
             ${
      isOnline
        ? "bg-blue-500 hover:bg-blue-500 text-white border-blue-400"
        : "bg-white/20 hover:bg-white/30 text-white border-white/30"
    }
  `}
            >
              <span className="hidden sm:inline">{isOnline ? "Mark Me Offline" : "Mark Me Online"}</span>
              <span className="sm:hidden">{isOnline ? "Offline" : "Online"}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* Your icon here */}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
            animate={{
              x: [Math.random() * 1200, Math.random() * 1200],
              y: [Math.random() * 800, Math.random() * 800],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-16 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 relative"
            animate={{
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mr-4"
            >
              <Sparkles className="w-12 h-12 text-yellow-500" />
            </motion.span>
            Start Earning Today!
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block ml-4"
            >
              <Zap className="w-12 h-12 text-yellow-500" />
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto px-4"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Join thousands of skilled professionals earning flexible income with
            job security and growth opportunities
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{
                scale: 1.1,
                y: -5,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 10px 20px rgba(16, 185, 129, 0.2)",
                  "0 15px 30px rgba(16, 185, 129, 0.3)",
                  "0 10px 20px rgba(16, 185, 129, 0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
               onClick={() => {
                            navigate("/provider/myjobs")
                            
                          }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Play className="w-7 h-7" />
              </motion.div>
              Start Working Now
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
                y: -5,
                borderColor: "#059669",
                color: "#059669",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-green-500 text-green-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
        >
          {[
            {
              number: "50,000+",
              label: "Active Providers",
              icon: <Users className="w-8 h-8" />,
              color: "from-blue-500 to-cyan-500",
            },
            {
              number: "₹2.5Cr+",
              label: "Monthly Earnings",
              icon: <Wallet className="w-8 h-8" />,
              color: "from-green-500 to-emerald-500",
            },
            {
              number: "4.8★",
              label: "Average Rating",
              icon: <Star className="w-8 h-8" />,
              color: "from-yellow-500 to-orange-500",
            },
            {
              number: "100%",
              label: "Payment Security",
              icon: <Shield className="w-8 h-8" />,
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{
                delay: 0.7 + index * 0.2,
                duration: 0.8,
                type: "spring",
              }}
              whileHover={{
                scale: 1.1,
                y: -10,
                rotateY: 10,
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center shadow-2xl border border-green-100 relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <motion.div
                className="text-green-600 mb-4 flex justify-center relative z-10"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 relative z-10"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 font-semibold relative z-10 text-sm sm:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-20"
        >
          <motion.h3
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-12 sm:mb-16 relative px-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Why Choose Domestic-Gap?
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-8 h-8 text-green-500" />
            </motion.div>
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{
                  delay: 0.9 + index * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -15,
                  rotateY: 5,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
                }}
                onHoverStart={() => setActiveFeature(index)}
                className={`bg-gradient-to-br ${feature.color} p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl text-white shadow-2xl cursor-pointer transform transition-all relative overflow-hidden group`}
              >
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                      animate={{
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        left: Math.random() * 100 + "%",
                        top: Math.random() * 100 + "%",
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  className="mb-6 relative z-10"
                  animate={{
                    rotate: activeFeature === index ? [0, 10, -10, 0] : 0,
                    scale: activeFeature === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>

                <motion.h4
                  className="text-xl sm:text-2xl font-bold mb-4 relative z-10"
                  animate={{
                    y: activeFeature === index ? [-2, 2, -2] : 0,
                  }}
                  transition={{
                    duration: 1,
                    repeat: activeFeature === index ? Infinity : 0,
                  }}
                >
                  {feature.title}
                </motion.h4>

                <motion.p
                  className="text-white/90 text-sm sm:text-base lg:text-lg relative z-10"
                  animate={{
                    opacity: activeFeature === index ? [0.9, 1, 0.9] : 0.9,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: activeFeature === index ? Infinity : 0,
                  }}
                >
                  {feature.description}
                </motion.p>

                {/* Hover glow effect */}
                <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services & Earnings */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Popular Services & Earnings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">
                    {service.name}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.demand === "Very High"
                        ? "bg-red-100 text-red-700"
                        : service.demand === "High"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {service.demand} Demand
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {service.earning}
                </div>
                <div className="text-gray-600">Average daily earnings</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.service}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {testimonial.rating}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.review}"</p>
                <div className="text-green-600 font-bold text-lg">
                  {testimonial.earnings}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-20">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your profile and verify documents",
                icon: <Users className="w-8 h-8" />,
              },
              {
                step: "2",
                title: "Get Requests",
                desc: "Receive job requests in your area",
                icon: <Bell className="w-8 h-8" />,
              },
              {
                step: "3",
                title: "Accept & Work",
                desc: "Accept jobs and provide quality service",
                icon: <CheckCircle className="w-8 h-8" />,
              },
              {
                step: "4",
                title: "Get Paid",
                desc: "Receive instant payments after completion",
                icon: <Wallet className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-xl">
                  {step.step}
                </div>
                <div className="text-green-600 mb-3 flex justify-center">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Provider;
