import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import axiosInstance from "../axiosInstance";
const VerifyOtp = () => {
  const location = useLocation();
 const navigate = useNavigate();
  if (!location.state) {
    navigate("/register", { replace: true });
    return null; // or return a loading spinner
  }
  const { email, firstName, lastName, password, role } = location.state;
 
   const [loading,setloading]=useState(false)
  const length = 6; 
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const[serverError,setServerError]=useState(null);
  const handleChange = (value, index) => {
    if (/[^0-9]/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  let error;
const handleVerify = async (e) => {

  e.preventDefault();
  setloading(true);

   const otpString = otp.join("");   
  
  try {
 
    const res = await axiosInstance.post("/api/auth/verify-otp", {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
      password: password,
      otp: otpString  // Send as string, not array
    });

    setloading(false);
     console.log(res);
    

    if(role==="user" &&res.data.status===200){
          navigate("/login", { replace: true });
    }
    else if(role==="provider"&&res.data.status===200){
       navigate("/login", { replace: true });
    }
    
  } catch (error) {
    
    setServerError(error.response.status);
    setloading(false);  // Add this
    
  }
};
  return (
    <>
    {
      serverError===401 && <div
      className="text-red-500 text-center"
      >Incorrect OTP</div>
    }
     {
      serverError===404 || serverError===500 && <div
      className="text-red-500 text-center"
      >
        Something Went Wrong, Please try again Later
      </div>
    }
      <form onSubmit={handleVerify}>
        <div className="mb-3 font-bold text-3xl text-center">
          OTP-Verification 
        </div>
        <div className="mb-2 flex-col justify-between">
          <div className="text-center mb-4">
            An OTP is send to email {email}
          </div>

          <div className="flex gap-3">
            {Array.from({ length }).map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className={`border-2 w-12 h-12 rounded-md mb-4 text-2xl text-center outline-none
          ${otp[i] ? "border-black font-bold" : "border-gray-400"}`}
                value={otp[i]}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          
          className="btn  w-full bg-gradient-to-br from-green-400 to-blue-500 "
        >
          {loading?(<CircularProgress size={20} color="inherit"/>):("Verify")}
        
        </button>
      </form>
    </>
  );
};
export default VerifyOtp;
