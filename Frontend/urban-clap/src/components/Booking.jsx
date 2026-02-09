import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Navigation,
} from "lucide-react";
import axiosInstance from "../axiosInstance";
import ProfileDropDown from "./ProfileDropDown";
import socket from "./Tracking/socket";
import MapView from "./Tracking/MapView";
import CircularProgress from "@mui/material/CircularProgress";
import { showerror } from "../react-toastify";
const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [trackingBooking, setTrackingBooking] = useState(null);

  // Tracking States
  const [providerPos, setProviderPos] = useState({
    lng: 80.128108,
    lat: 27.405652 ,
  });
  const [userPos, setUserPos] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [etaMin, setEtaMin] = useState(0);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/getmybookings");
      if (response.data.status === 200) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Socket.IO: Listen for provider location updates
useEffect(() => {
  if (!trackingBooking?.id) return;

  const bookingId = String(trackingBooking.id);
  console.log("📡 Joining booking:", bookingId);

  socket.emit("join-booking", { bookingId, role: "user" });

  const handleProviderLocation = (payload) => {
    console.log("📍 Received provider location:", payload);

    if (payload?.providerPos?.lat && payload?.providerPos?.lng) {
      setProviderPos(payload.providerPos);
    }

    setRouteCoords(payload.routeCoords||[])
    setDistanceKm(payload.distanceKm || 0);
    setEtaMin(payload.etaMin || 0);
  };

  socket.on("provider-location", handleProviderLocation);

  return () => {
    socket.off("provider-location", handleProviderLocation);
  };
}, [trackingBooking?.id]);

  // Transform and filter bookings
  const transformedBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "completed" && b.status !== "cancelled")
        .map((b) => ({
          id: b.bookingId,
          service: b.category,
          serviceman: b.providerId?.providerId
            ? `${b.providerId.providerId.firstName} ${b.providerId.providerId.lastName}`
            : null,
          date: new Date(b.scheduledDate).toLocaleDateString("en-IN"),
          time: b.scheduledTime,
          status: b.status,
          address: `${b.serviceAddress.street}, ${b.serviceAddress.landmark}, ${b.serviceAddress.city}, ${b.serviceAddress.state}`,
          amount: `₹${b.price}`,
          description: b.jobDescription,
          coordinates: b.serviceAddress.location?.coordinates,
          raw: b,
        })),
    [bookings]
  );

  const activeStatuses = ["accepted", "assigned", "ontheway", "reached", "in_progress"];

  const activeBookings = useMemo(
    () => transformedBookings.filter((b) => activeStatuses.includes(b.status)),
    [transformedBookings]
  );

  const filteredBookings = useMemo(() => {
    const bookingsToFilter = selectedFilter === "active" ? activeBookings : transformedBookings;
    if (!searchQuery) return bookingsToFilter;

    const searchLower = searchQuery.toLowerCase();
    return bookingsToFilter.filter(
      (b) =>
        b.id.toLowerCase().includes(searchLower) ||
        b.service.toLowerCase().includes(searchLower) ||
        b.serviceman?.toLowerCase().includes(searchLower)
    );
  }, [transformedBookings, activeBookings, selectedFilter, searchQuery]);

  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    accepted: { label: "Accepted", color: "bg-blue-100 text-blue-700" },
    assigned: { label: "Assigned", color: "bg-purple-100 text-purple-700" },
    ontheway: { label: "On The Way", color: "bg-cyan-100 text-cyan-700" },
    reached: { label: "Reached", color: "bg-indigo-100 text-indigo-700" },
    in_progress: { label: "In Progress", color: "bg-green-100 text-green-700" },
  };

  const handleTrackBooking = (booking) => {
    console.log("BOOKING STATUS .......",booking);
    if (!booking.coordinates) {
      showerror("Location data not available for this booking.");
      return;
    }

    // Set user position from booking coordinates
    setUserPos({
      lat: booking.coordinates[0],
      lng: booking.coordinates[1],
    });

    // Reset provider position - will be set when socket receives data
    setProviderPos(null);
    setRouteCoords([]);
    setDistanceKm(0);
    setEtaMin(0);

    setTrackingBooking(booking);
  
  };

  const closeTracking = () => {
    setTrackingBooking(null);
    setProviderPos(null);
    setUserPos(null);
    setRouteCoords([]);
    setDistanceKm(0);
    setEtaMin(0);
  };

  const handleCancel = async (booking) => {
    try {
      await axiosInstance.post("/api/auth/cancelbooking", {
        bookingId: booking.id,
      });
      fetchBookings();
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const BookingCard = ({ booking }) => {
    const isExpanded = expandedBooking === booking.id;
    const hasServiceman = !!booking.serviceman;
    const canTrack = booking.status === "ontheway" && hasServiceman;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-l-4 border-green-500">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {booking.service.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-800">
                      {booking.service}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusConfig[booking.status]?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusConfig[booking.status]?.label || booking.status}
                    </span>
                    {activeStatuses.includes(booking.status) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    {hasServiceman ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{booking.serviceman}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 col-span-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">
                          No serviceman assigned yet
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  {booking.amount}
                </div>
                <div className="text-xs text-gray-500 mt-1">ID: {booking.id}</div>
              </div>
              <button
                onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-green-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-green-600" />
                )}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Service Address
                  </h4>
                  <p className="text-gray-600 bg-green-50 p-3 rounded-lg">
                    {booking.address}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Service Provider
                  </h4>
                  {hasServiceman ? (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-800 font-medium">{booking.serviceman}</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <p className="text-orange-600 font-medium">Waiting for assignment</p>
                    </div>
                  )}
                </div>
              </div>

              {booking.description && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {booking.description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                {canTrack && (
                  <button
                    onClick={() => handleTrackBooking(booking)}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Track Booking
                  </button>
                )}
                {hasServiceman && (
                  <button className="flex-1 min-w-[200px] bg-white border-2 border-green-500 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all">
                    Raise Complaint
                  </button>
                )}
                {booking.status === "pending" && (
                  <button
                    className="px-6 bg-red-50 border-2 border-red-200 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-all"
                    onClick={() => handleCancel(booking)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Determine if we should show the map
  const showMap = trackingBooking && userPos && providerPos;
  console.log("TRACKING ", trackingBooking);
  console.log("USER POS", userPos);
  console.log("PROVIDER POS", providerPos);
  console.log("SHOW MAP", showMap);
  console.log("Route coords:", routeCoords);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg rounded-b-[60px] px-6 py-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-green-100">Track and manage your service bookings</p>
        </div>
        <ProfileDropDown />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Toggle */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`p-6 rounded-xl shadow-md transition-all transform hover:scale-105 ${
              selectedFilter === "all"
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-200"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <div className="text-3xl font-bold mb-2">{transformedBookings.length}</div>
            <div className={`text-base font-medium ${selectedFilter === "all" ? "text-green-50" : "text-gray-600"}`}>
              All Bookings
            </div>
          </button>

          <button
            onClick={() => setSelectedFilter("active")}
            className={`p-6 rounded-xl shadow-md transition-all transform hover:scale-105 ${
              selectedFilter === "active"
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-200"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <div className="text-3xl font-bold mb-2">{activeBookings.length}</div>
            <div className={`text-base font-medium ${selectedFilter === "active" ? "text-green-50" : "text-gray-600"}`}>
              Active Bookings
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by booking ID, service, or serviceman name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tracking Section */}
        {trackingBooking && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Navigation className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Tracking: {trackingBooking.service}
                  </h3>
                  <p className="text-sm text-gray-600">Booking ID: {trackingBooking.id}</p>
                </div>
              </div>
              <button
                onClick={closeTracking}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
              >
                Close Tracking
              </button>
            </div>

            {/* Map Container */}
            <div className="bg-gray-100 rounded-lg h-86 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
              {showMap ? (
                <div className="w-full h-full">
                  <MapView
                    center={providerPos}
                    route={routeCoords}
                    providerPos={providerPos}
                    userPos={userPos}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <CircularProgress size={40} className="text-green-600 mb-4" />
                  <p className="text-gray-700 font-medium">Waiting for provider location...</p>
                  <p className="text-gray-500 text-sm">Map will appear when provider shares location</p>
                  <div className="mt-4 text-xs text-gray-400">
                    <p>Tracking: {trackingBooking ? '✓' : '✗'}</p>
                    <p>User Position: {userPos ? '✓' : '✗'}</p>
                    <p>Provider Position: {providerPos ? '✓' : '✗'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Distance</p>
                <p className="text-2xl font-bold text-green-700">
                  {distanceKm > 0 ? `${distanceKm.toFixed(1)} km` : "-"}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                <p className="text-2xl font-bold text-blue-700">
                  {etaMin > 0 ? `${etaMin} min` : "-"}
                </p>
                  </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-gray-800">
                  {statusConfig[trackingBooking.status]?.label || trackingBooking.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {selectedFilter === "active"
                  ? "You have no active bookings at the moment"
                  : "Try adjusting your search query"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;