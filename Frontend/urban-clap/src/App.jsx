import { motion } from "framer-motion";
import Register from "./components/Register";
import "./App.css";
import RegisterAnimation from "./components/RegisterAnimation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyOtp from "./components/VerifyOtp";
import HomePage from "./components/HomePage";
import BookingsPage from "./components/Booking";
import UpdateAddress from "./UpdateAddress";
import UpdateProfile from "./components/UpdateProfile";
import Provider from "./components/Provider";
import PostOrderPage from "./components/PostOrderHistory";
import WorkerSearch from "./components/WorkerSearch";
import Login from "./components/Login";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfileOtp from "./components/UpdateProfileOtp";
import CompleteWorkerProfile from "./components/CompleteWorkerProfile"
import ProviderJobsDashboard from "./components/MyJobs";
import ConfirmBooking from "./components/ConfirmBooking";
import BookingDetails from "./components/ConfirmBooking";
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 🔓 Public Routes */}
            <Route element={<RegisterAnimation />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/verify-otp" element={<VerifyOtp />} />
            </Route>

            {/* 🔐 Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/provider" element={<Provider />}></Route>
              <Route path="updation-otp" element={<UpdateProfileOtp/>}></Route>
              <Route path="/services/:serviceName/confirm-booking" element={<ConfirmBooking/>} />
              <Route path="/provider/complete-profile" element={<CompleteWorkerProfile/>} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/updateAddress" element={<UpdateAddress />} />
              <Route path="/provider/myjobs" element={<ProviderJobsDashboard/>}></Route>
              <Route path="updateProfile" element={<UpdateProfile />} />
              <Route path="/user/PostOrderPage" element={<PostOrderPage />} />
              <Route path="/services/:serviceName" element={<WorkerSearch />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
