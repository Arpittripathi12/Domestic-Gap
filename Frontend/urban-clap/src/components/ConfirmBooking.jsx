import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Phone,
  Star,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosInstance from "../axiosInstance";

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <div className="mb-4">
          <CheckCircle size={80} className="text-green-600 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your service has been booked successfully. The worker will contact you
          shortly.
        </p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const { user: loginUser } = useAuth();
  const location = useLocation();
  const worker = location.state?.workerDetails;
  const [selectedAddress, setSelectedAddress] = useState("current");
  const [customAddress, setCustomAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [description,setdescription]=useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const savedAddresses = loginUser.addresses;
 let CurrentLocation={
  label:"",
  street:"",
  landmark:"",
  city:"",
  pincode:"",
  state:"",
  location:{
    coordinates:[],
  }
 };
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ];

  // Handle case where worker data is not passed
  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Worker Selected</h2>
          <p className="text-gray-600 mb-6">Please select a worker to book.</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  useEffect(() => {
    return () => console.log(selectedAddress);
  }, [selectedAddress]);
  const totalAmount = worker.price;
  const platformFee = 50;
  const GST = ((totalAmount + platformFee) * 18) / 100;
  const finalAmount = (totalAmount + platformFee + GST).toFixed(2);





    const handleCurrentLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          console.log("Accuracy (meters):", pos.coords.accuracy);

          try {
            await axiosInstance.post("/api/auth/location/update", {
              lat: lat,
              lng: lng,
            });

            // if (pos.coords.accuracy > 200) {
            //   alert(
            //     "Location not accurate. Please select from Saved Addresses."
            //   );
            //   return;
            // }
            CurrentLocation.location.coordinates=[lat,lng]
            console.log("Current location:", lat,lng);

          } catch (error) {
            console.error("Error updating location:", error);
            alert("Failed to update location. Please try again.");
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          alert(
            "Location access denied. Please select a saved address or enable location access."
          );
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
    }
  };








  const handleConfirmBooking = async() => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    if(description.trim().length===0){
        alert("Select description of problem");
        return;
    }
    if (selectedAddress === "custom" && !customAddress.trim()) {
      alert("Please enter your address");
      return;
    }

    try {
      console.log(customAddress);
      const res=await axiosInstance.post("/api/booking/confirm-booking",{
        provider:worker,
        jobDescription:description,
        scheduledDate:selectedDate,
        scheduledTime:selectedTime,
        serviceAddress:selectedAddress==="current"?CurrentLocation:customAddress,
        paymentMethod:paymentMode,
        finalPrice:finalAmount
        
      })

      console.log("Reponse From Booking",res);
      setShowSuccess(true);
    } catch (error) {
       console.log("Something went wrong")

    }
    // Show success popup
    
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/home"); // Navigate to home or wherever you want
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Workers
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 ">{worker.name}</h1>
                <p className="text-xl text-gray-600 mb-3">{worker.job}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <Star size={16} className="mr-1 fill-current" />
                    {worker.rating} ({worker.reviews} reviews)
                  </span>
                  <div className="text-gray-600 ">
                    <strong>Experience :</strong> {worker.experience}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MapPin className="mr-2" size={24} />
              Service Location
            </h2>

            <div className="space-y-3">
              <label className="flex items-center p-3 mr-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="address"
                  value="current"
                  checked={selectedAddress === "current"}
                  onChange={(e) =>{ setSelectedAddress(e.target.value)

                    handleCurrentLocation()
                  }}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Use Current Location</div>
                  <div className="text-sm text-gray-600">
                    We'll detect your location automatically
                  </div>
                </div>
              </label>

              {savedAddresses.map((addr) => (
                <label
                  key={addr._id}
                  className="flex items-center p-3 mr-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={(e) =>{ setSelectedAddress(e.target.value)
                      setCustomAddress(addr)}
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">{addr.label}</div>
                    <div className="text-sm text-gray-600">{`${addr.landmark}, ${addr.street}, ${addr.city}`}</div>
                  </div>
                </label>
              ))}
              <button
                className=" flex  items-center p-3 border  bg-green-400 rounded cursor-pointer hover:bg-green-700"
                onClick={() => navigate("/updateAddress")}
              >
                <div className="flex-1 semibold">Add Custom Address</div>
              </button>
            </div>

            {worker.distance && worker.location?.area && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-semibold">
                  📍 Worker is approximately {(worker.distance*0.001).toFixed(1)} km
                  away from Your Location
                </p>
              </div>
            )}
          </div>

          {/* Date & Time Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" size={24} />
              Schedule Service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Problem Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                placeholder="My Electric motor is not working properly"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Pricing Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price </span>
                <span className="font-semibold">
                  ₹{totalAmount} (includes up to 1 hour)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold">₹{platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600"> GST (18%)</span>
                <span className="font-semibold">₹{GST}</span>
              </div>
              <p>Extra time will be charged ₹99 per 30 mins.</p>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-green-600">₹{finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CreditCard className="mr-2" size={24} />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center p-3 mr-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMode === "COD"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Cash on Service</div>
                  <div className="text-sm text-gray-600">
                    Pay after service completion
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMode === "online"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Online Payment</div>
                  <div className="text-sm text-gray-600">
                    UPI, Card, Net Banking
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Confirm Booking Button */}
          <button
            onClick={handleConfirmBooking}
            className="w-full bg-green-600 text-white py-4 rounded   text-lg font-bold hover:bg-green-700 shadow-lg"
          >
            Confirm Booking - ₹{finalAmount}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && <SuccessPopup onClose={handleSuccessClose} />}
    </>
  );
};

export default ConfirmBooking;
