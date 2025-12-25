import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Home,
  Building2,
  Trash2,
  Plus,
  Check,
  Star,
  Edit3,
  Navigation,
  Search,
  Map,
  House,
} from "lucide-react";
import ProfileDropDown from "./components/ProfileDropDown";
import SelectLocationMap from "./components/SelectLocationMap";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { CircularProgress } from "@mui/material";
import { useAuth } from "./components/AuthContext";

export default function UpdateAddress() {
  const {user:loginuser}=useAuth();
  const addresses=loginuser?.addresses||[]
  console.log(loginuser)
  const [loading, setLoading] = useState(false);
  const [showMapSelection, setShowMapSelection] = useState(false);
  const [mapSelected, setMapSelected] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [location, setlocation] = useState({
    lat: null,
    lng: null,
  });

  const handleSelectCurrentlocation = () => {
    setShowMap(true);
  };
  const [form, setForm] = useState({
    label: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    house: "",
    isDefault: false,
    location: {
      coordinates: [],
    },
  });
   const deleteAddress=()=>{
    alert("Delete Address feature coming soon!")
   }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDefault = () => {
    setForm({ ...form, isDefault: !form.isDefault });
  };

  const handleMapClick = () => {
    setShowMapSelection(true);
  };

  const handleMapConfirm = async () => {
    // Simulate selecting location from map
    setLoading(true);
    setIsConfirmed(true);

    console.log("Final location:", location.lat, location.lng);

    const { lat, lng } = location;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/location/reverse",
        { lat, lng }
      );
      console.log(res);
      const data = res.data;
      const city =
        data.address?.city || data.address?.town || data.address?.village || "";
      const state = data.address?.state || "";

      setForm((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [lat, lng], // MongoDB format
        },
        city,
        state,
      }));
      
      setLoading(false);
      setMapSelected(true);
      alert("Location selected successfully!");
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      alert("Unable to fetch address details");
    }
  };

  const addAddress = async () => {
    if (!mapSelected) {
      alert("Please select location from map first!");
      return;
    }

    if (!form.label || !form.street || !form.house) {
      alert("Please fill all required fields!");
      return;
    }
    setLoading(true)
    try {
      // Uncomment when ready to use
      const res = await axiosInstance.put("/api/auth/update-address", {
        savedAddress: true,
        address: form,
      });

      console.log("Adding address:", form);
      alert("Address Added Successfully!");
      setLoading(false);
      // Reset form
      setForm({
        label: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        house: "",
        isDefault: false,
        location: { coordinates: [] },
      });
      setMapSelected(false);
      setShowMapSelection(false);
    } catch (err) {
      console.error(err);
      alert("Error adding address");
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
  //       <motion.div
  //         animate={{ rotate: 360 }}
  //         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  //         className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-2xl relative overflow-hidden rounded-b-[60px] rounded-bl-[40px] rounded-br-[40px]"
      >
        <div className=" flex   max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent"
              >
                Manage Addresses
              </motion.h1>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-green-100 text-lg"
              >
                Add and manage your delivery addresses
              </motion.p>
            </div>
          </div>
          <ProfileDropDown />
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6">
        {/* ADD NEW ADDRESS */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">
              Add New Address
            </h2>
          </div>

          {/* Map Selection Button */}
          {!showMapSelection ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMapClick}
              className="w-full mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Map className="w-6 h-6" />
              Choose Location from Map
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
              onClick={handleSelectCurrentlocation}
            >
              {/* Simulated Map View */}
              {!showMap && (
                <div className="relative w-full h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl border-4 border-green-300 overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-700 font-semibold text-lg">
                        Tap on map to select your location
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        This is a simulated map view
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {showMap && (
                <SelectLocationMap
                  setLocation={setlocation}
                  isConfirmed={isConfirmed}
                />
              )}

              {!mapSelected ? (
                <div className="relative w-full mt-4">
                  <motion.button
                    whileHover={ { scale: 1.02 } }
                    whileTap={{ scale: 0.98 } }
                    onClick={handleMapConfirm}
                    
                    className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg
                    flex items-center justify-center gap-3 transition-all shadow-lg `}
                  >
                    
                    
                    {
                      loading?<CircularProgress size={21} color="white"/>
                      :<>
                       <Check className="w-6 h-6" />
                        Confirm Location
                      </>
                     
                     
                    
                    }
                      
                    
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border-2 mt-4 border-green-500 rounded-2xl p-4 flex items-center gap-3"
                >
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="text-green-700 font-semibold text-lg">
                    Location Selected! Add more details below
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Address Details Form - Only show after map selection */}
          <AnimatePresence>
            {mapSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 pb-6 border-b-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-green-600" />
                    Add More Address Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Label Select */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600 pointer-events-none z-10">
                      {form.label === "Home" ? (
                        <Home className="w-5 h-5" />
                      ) : form.label === "Work" ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                    </div>
                    <select
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium appearance-none cursor-pointer"
                      name="label"
                      onChange={handleChange}
                      value={form.label}
                      required
                    >
                      <option value="" disabled>
                        Select Label *
                      </option>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </motion.div>

                  {/* HouseNO Input */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                      <House className="w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                      placeholder="Flat / House no / Building name"
                      name="house"
                      onChange={handleChange}
                      value={form.house}
                      required
                    />
                  </motion.div>

                  {/* Street Input */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                      placeholder="Street Address *"
                      name="street"
                      onChange={handleChange}
                      value={form.street}
                      required
                    />
                  </motion.div>

                  {/* Landmark Input */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                      placeholder="Landmark (Optional)"
                      name="landmark"
                      onChange={handleChange}
                      value={form.landmark}
                    />
                  </motion.div>

                  {/* City Input (Pre-filled from map) */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                      placeholder="City"
                      name="city"
                      onChange={handleChange}
                      value={form.city}
                      readOnly
                    />
                  </motion.div>

                  {/* State Input (Pre-filled from map) */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-focus-within:text-green-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white font-medium"
                      placeholder="State"
                      name="state"
                      onChange={handleChange}
                      value={form.state}
                      readOnly
                    />
                  </motion.div>
                </div>

                {/* Default Address Toggle */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 mt-8  p-4 bg-gradient-to-r from-green-50 to-emerald-50 mb-4 rounded-2xl border border-green-200"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative w-6 h-6 rounded-lg border-2 cursor-pointer transition-all ${
                      form.isDefault
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                    onClick={handleDefault}
                  >
                    <AnimatePresence>
                      {form.isDefault && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center "
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <label
                    className="cursor-pointer text-gray-700 font-semibold text-lg "
                    onClick={handleDefault}
                  >
                    Set as Default Address
                  </label>
                  {form.isDefault && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </motion.div>

                {/* Add Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  onClick={addAddress}
                >
                   {
                      loading?<CircularProgress size={21} color="white"/>
                      :<>
                       <Plus className="w-6 h-6" />
                  Add Address
                      </>
                    }
                  
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SAVED ADDRESSES */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Saved Addresses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {addresses.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-green-100 shadow-lg"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <MapPin className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No addresses saved yet
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Add your first address to get started
                  </p>
                </motion.div>
              ) : (
                addresses.map((addr, index) => (
                  <motion.div
                    key={addr._id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          {addr.label.toLowerCase().includes("home") ? (
                            <Home className="w-5 h-5 text-white" />
                          ) : addr.label.toLowerCase().includes("work") ? (
                            <Building2 className="w-5 h-5 text-white" />
                          ) : (
                            <MapPin className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {addr.label}
                          </h3>
                          {addr.isDefault && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-semibold mt-1"
                            >
                              <Star className="w-3 h-3 fill-current" />
                              Default
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteAddress(addr._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="space-y-2 text-gray-700">
                      <p className="font-medium">{addr.street}</p>
                      {addr.landmark && (
                        <p className="text-gray-600">Near {addr.landmark}</p>
                      )}
                      <p className="font-medium">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 py-3 rounded-xl font-semibold hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200 flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Address
                    </motion.button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
