import { motion } from "framer-motion";
import Register from "./Register";
import sideimage from "../assets/sideimage.jpg";
import { Outlet, useLocation } from "react-router-dom";
import VerifyOtp from "./VerifyOtp";

const RegisterAnimation = () => {
  const location = useLocation();
  const isVerifyOtpPage = location.pathname === "/register/verify-otp";
  const isloginPage = location.pathname === "/login";

  return (
    <>
      <div className="flex">
        <div className="md:w-1/2 w-0">
          <img
            src={sideimage}
            alt="Side visual"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 w-full flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-white/20 to-green-200/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-r from-emerald-200/30 to-white/20 rounded-full animate-bounce delay-1000"></div>
            <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-r from-blue-200/30 to-emerald-200/30 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 left-16 w-16 h-16 bg-gradient-to-r from-white/30 to-blue-200/30 rounded-full animate-bounce delay-700"></div>
            <div className="absolute top-20 right-1/3 w-12 h-12 bg-gradient-to-r from-emerald-200/40 to-white/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-10 left-1/3 w-14 h-14 bg-gradient-to-r from-blue-200/30 to-emerald-200/40 rounded-full animate-bounce delay-1200"></div>
            
            {/* Floating Sparkles */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full opacity-70 animate-ping delay-200"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-80 animate-ping delay-800"></div>
            <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white rounded-full opacity-90 animate-ping delay-1500"></div>
            <div className="absolute bottom-1/4 right-1/6 w-2.5 h-2.5 bg-white rounded-full opacity-60 animate-ping delay-600"></div>
            <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-white rounded-full opacity-100 animate-ping delay-400"></div>
            
            {/* Moving Gradient Overlays */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-300/10 via-transparent to-blue-300/10 animate-pulse delay-1000"></div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-16 right-20 w-8 h-8 border-2 border-white/30 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute bottom-32 left-20 w-6 h-6 border-2 border-emerald-200/40 rotate-12 animate-spin" style={{animationDuration: '6s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 border border-white/50 rounded-full animate-pulse delay-900"></div>
          </div>
          <div className="text-5xl  uppercase font-bold text-center mb-3">
            DomestiC-Gap
          </div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl italic text-white text-center font-bold "
          >
            "Get Trusted Home Services on Demand"
          </motion.div>

          <div className="text-md italic text-center text-xl">
            Register to book or provide expert services
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-lg shadow-2xl drop-shadow-2xl px-5 py-4 m-6 border border-white/20 hover:shadow-green-300/30 hover:bg-white/98 transition-all duration-500 hover:scale-[1.02] relative z-10"
          >
            {/* Show ONLY Register on /register */}
            <Outlet/>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterAnimation;
