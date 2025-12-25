import {motion} from "framer-motion"
import ProfileDropDown from "./ProfileDropDown";
import {replace, useNavigate} from "react-router-dom";
const Header = () => {
  const navigate = useNavigate(); 
  const scrollToSection=(sectionId)=>{
    const element=document.getElementById(sectionId);
    if(element){
      element.scrollIntoView({
        behavior:"smooth",
        block:"start"
      })
    }
  }
  return (
    <>
    <div className="flex justify-center w-full mt-6 px-4">
        <motion.div
         initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 120,
          damping: 12
        }}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(0, 0, 0, 0.15)" }}
        className="fixed bg-white z-40 flex items-center justify-between max-w-4xl w-full rounded-full shadow-sm border px-3 sm:px-6 py-2"
        >
        {/* Left Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="font-bold text-sm lg:text-lg hover:bg-green-100 rounded-full px-2 lg:px-4 py-2 cursor-pointer" onClick={()=>scrollToSection('WhyUs')}>
            Why Us
          </div>
          <div className="font-bold text-sm lg:text-lg hover:bg-green-100 rounded-full px-2 lg:px-4 py-2 cursor-pointer" onClick={()=>scrollToSection('Services')}>
            Services
          </div>
        </div>

        {/* Brand Name - Responsive */}
        <div className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-extrabold mx-auto md:mx-0">
          Domestic-Gap
        </div>

        {/* Right Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="font-bold text-sm lg:text-lg hover:bg-green-100 rounded-full px-2 lg:px-4 py-2 cursor-pointer" onClick={()=>scrollToSection('HowItWorks')}>
            How it Works
          </div>
          <div className="font-bold text-sm lg:text-lg hover:bg-green-100 rounded-full px-2 lg:px-4 py-2 cursor-pointer" onClick={()=>navigate("/bookings")}>
            Bookings
          </div>
        </div>
      </motion.div>
        <div className="fixed top-22 right-4 z-50 lg:relative lg:top-0 lg:right-0 lg:z-auto  ">
          <ProfileDropDown/>
        </div>
    </div>
    
    </>
  );
};

export default Header;
