import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "./AuthContext";
import axiosInstance from "../axiosInstance";
import { useEffect } from "react";
const UpdateProfileOtp = () => {
  const { setuser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/register", { replace: true });
    return null;
  }
  let email;
  const { phone, firstName, lastName, password,profileImage} = location.state;
  const [loading, setloading] = useState(false);
  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const [serverError, setServerError] = useState(null);

  const handleChange = (value, index) => {
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  useEffect(()=>{
    profileImage && console.log("PROFILE IMAGE IN OTP PAGE ........",profileImage);
  },[])

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setloading(true);

    const otpString = otp.join("");
    
    try {
      const res = await axiosInstance.put("api/auth/updateprofile-data", {
        firstName: firstName,
        lastName: lastName,
        password: password,
        otp: otpString,
        phone: phone,
      });
      if (res.status === 200 && profileImage) {

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    const res2 = await axiosInstance.post(
      "/api/auth/upload-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("IMAGE UPLOAD SUCCESS:", res2.data);
  }
  else{
    console.log("NO PROFILE IMAGE TO UPLOAD");
  }
      
      console.log("MY DATA ..........",res);
      email = res.data.data.email;
      setloading(false);
      console.log("STATUS ....",res.data.status)
      if (res.data.status === 200) {
        navigate("/login", { replace: true });
      }

      alert("Profile Updated Successfully , Please Login to Continue");
    } catch (error) {
      const status = error?.response?.status || 500;
  setServerError(status);
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
    
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Profile
          </h1>
          <p className="text-gray-500 text-lg">
            Manage your personal information
          </p>
        </div>

        {/* OTP Form Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-12 shadow-sm">
          {serverError === 401 && (
            <div className="text-red-500 text-center text-lg mb-6 p-4 bg-red-50 rounded-lg">
              Incorrect OTP
            </div>
          )}

          {(serverError === 404 || serverError === 500) && (
            <div className="text-red-500 text-center text-lg mb-6 p-4 bg-red-50 rounded-lg">
              Something Went Wrong, Please try again Later
              {serverError}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-8 font-bold text-4xl text-center text-gray-900">
              OTP Verification
            </div>

            <div className="mb-8 flex flex-col justify-between">
              <div className="text-center mb-8 text-lg text-gray-600">
                An OTP has been sent to email{" "}
                <span className="font-semibold text-gray-900">{email}</span>
              </div>

              <div className="flex gap-4 justify-center">
                {Array.from({ length }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className={`border-2 w-16 h-16 rounded-xl text-3xl text-center outline-none transition-all
                      ${
                        otp[i]
                          ? "border-blue-500 font-bold bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
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
              className="w-full bg-gradient-to-br from-green-400 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl text-lg hover:shadow-lg transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileOtp;
