import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import axiosInstance from "../axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let [serverError, setServerError] = useState(null);

  // Validation functions
  const validateName = (name, value) => {
    if (!value.trim()) {
      return "";
    }
    if (/\d/.test(value)) {
      return `${name} should not contain numbers`;
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return `${name} should only contain letters`;
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setformData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    let error = "";
    if (name === "firstName") {
      error = validateName("First name", value);
    } else if (name === "lastName") {
      error = validateName("Last name", value);
    } else if (name === "email") {
      error = validateEmail(value);
    } else if (name === "role") {
      error = "";
    }

    setErrors({
      ...errors,
      [name]: error,
    });

    // Clear server error when user starts typing
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      firstName: validateName("First name", formData.firstName),
      lastName: validateName("Last name", formData.lastName),
      email: validateEmail(formData.email),
      role: !formData.role ? "Please select a role" : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      return;
    }

    setloading(true);
    try {
      const res = await axiosInstance.post("/api/auth/send-otp", {
        email: formData.email,
      });
      setloading(false);
    

      if (res.data.status === 200) {
        navigate("/register/verify-otp", {
          state: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            role: formData.role,
          },
        });
      } else {
        setServerError();
      }
    } catch (error) {
      console.log(error.response.status);
      setServerError (error.response.status);
      setloading(false);
     
    }
  };

  return (
    <>
      {serverError === 300 && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">
          Email already registered. Please Login to Continue
        </div>
      )}
      {serverError === 500 && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">
          Something went wrong, please try again later
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 font-bold text-3xl text-center">Register</div>
        
        <div className="mb-2 flex justify-between">
          <div className="mr-2 flex-1">
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              className={`form-control w-full ${
                errors.firstName ? "border-red-500 border-2" : ""
              }`}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div className="ml-2 flex-1">
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              className={`form-control w-full ${
                errors.lastName ? "border-red-500 border-2" : ""
              }`}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            className={`form-control w-full ${
              errors.email ? "border-red-500 border-2" : ""
            }`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control w-full pr-10"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">Select Role</label>
          <select
            className={`form-select custom-select w-full ${
              errors.role ? "border-red-500 border-2" : ""
            }`}
            onChange={handleChange}
            name="role"
            required
            value={formData.role}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="user">User</option>
            <option value="provider">Worker</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>
        
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="btn w-full bg-gradient-to-br from-green-400 to-blue-500 text-white py-2 rounded"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
};

export default Register;