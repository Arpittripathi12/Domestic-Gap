import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });
  const [googleloading, setgoogleloading] = useState(false);
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let [serverError, setServerError] = useState(null);

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

    if (name === "email") {
      error = validateEmail(value);
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

  const handleGoogleLogin = async (response) => {
    setgoogleloading(true);
    try {
      const res = await axiosInstance.post("/api/auth/google", {
        accessToken: response.access_token,
        // idToken:response.credential,
      });
      console.log("DATA FROM GOOGLE LOGIN ", res);
      setUser(res.data.data)
      if (res.data.status === 200) {
        if (res.data.data.role === "user") {
          navigate("/home", {
            state: {
              user: res.data.data.user,
            },
          });
        } else if (res.data.data.role === "provider") {
          navigate("/provider", {
            state: {
              email: formData.email,

              password: formData.password,
            },
          });
        }
      } else {
        setServerError();
      }
      setgoogleloading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      console.log("Google Sign In was unsuccessful. Try again later");
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {
      email: validateEmail(formData.email),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    setloading(true);
    try {
      console.log("Form Data Submitted: ", formData);
      const res = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Data from Login ", res);
      setUser(res.data.data.user);
      setloading(false);
      console.log(res);
      if (res.data.status === 200) {
        if (res.data.data.role === "user") {
          navigate("/home", {
            state: {
              user: res.data.data.user,
            },
          });
        } else if (res.data.data.role === "provider") {
          navigate("/provider", {
            state: {
              email: formData.email,

              password: formData.password,
            },
          });
        }
      } else {
        setServerError();
      }
    } catch (error) {
      console.log(error.response.status);
      setServerError(error.response.status);
      setloading(false);
    }
  };

  return (
    <>
      {serverError === 401 && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">
          Email does not registered
          <br />
          Please Register to Continue
        </div>
      )}
      {serverError === 402 && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">
          Password is Incorrect
        </div>
      )}
      {serverError === 500 && (
        <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">
          Something Went Wrong, Please try again Later
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 font-bold text-3xl  text-center ">Login</div>

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
          {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
        </button>
        <div className="text-center m-1">--- Or ---</div>

        <button
          type="button"
          onClick={() => {
            login();
          }}
          className="btn w-full bg-gradient-to-br  from-green-400 to-blue-500 text-white py-2 rounded mb-2"
        >
          {googleloading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <div className="flex justify-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
                className="h-6 w-6 mr-5"
              ></img>
              <div className="">Sign In With Google</div>
            </div>
          )}
        </button>
        <div className="mt-2 text-center  text-gray-600 text-bold">
          <span>Not a member? </span>
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:text-blue-700 no-underline "
          >
            Register
          </Link>
        </div>
      </form>
    </>
  );
};

export default Login;
