import React, { useState, useEffect } from "react";
import ProfileDropDown from "./ProfileDropDown";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosInstance from "../axiosInstance";
import { predictWorkerBasePrice } from "../workerData";

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function WorkerSearch() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { user: loginUser } = useAuth();
  const savedAddresses = loginUser.addresses;

  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [jobFilter, setJobFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [locationSelected, setLocationSelected] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    if (serviceName) {
      setJobFilter(serviceName);
    }
  }, [serviceName]);

  // Fetch nearby workers from API
  const fetchNearbyWorkers = async (lat, lng) => {
    setLoadingWorkers(true);
    try {
      const response = await axiosInstance.get(
        `/api/provider/nearby-providers?lat=${lat}&lng=${lng}`
      );

      console.log("GET NEARBY WORKERS:", response);

      if (response.data?.data) {
        const formattedWorkers = response.data.data.map((provider) => ({
          id: provider._id,
          name: `${provider.user.firstName} ${provider.user.lastName}`,
          job: provider.skills[0], // Primary skill
          allSkills: provider.skills, // All skills
          experience: `${provider.experience} years`,
          rating: provider.rating || 0,
          reviews: provider.totalRatings || 0,
price: predictWorkerBasePrice({
  skill: provider.skills[0],
  experience: provider.experience,
  rating: provider.rating,
  distance: provider.distance,
}),
          priceUnit: "per visit",
          phone: "Not Available",
          availability: "Mon-Sun",
          specialization: provider.skills,
          location: {
            area: "Nearby",
            city: "Your City",
            latitude: provider.currentLocation.coordinates[1],
            longitude: provider.currentLocation.coordinates[0],
          },
          distance: provider.distance ? Math.round(provider.distance) : 0,
        }));

        setWorkers(formattedWorkers);
      }
    } catch (error) {
      console.error("Failed to load workers:", error);
      alert("Failed to fetch nearby workers. Please try again.");
    } finally {
      setLoadingWorkers(false);
    }
  };

  // Handle current location
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

            setUserLocation({ lat, lng });
            console.log("Current location:", lat, lng);

            setLocationSelected(true);
            setShowLocationModal(false);

            // Fetch nearby workers
            await fetchNearbyWorkers(27.406513, 80.123192);
            console.log(lat, lng);
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

  // Handle saved address selection
  const handleSavedAddress = async (address) => {
    setLoadingLocation(true);
    const lat = address.location.coordinates[1];
    const lng = address.location.coordinates[0];

    try {
      await axiosInstance.post("/api/auth/location/update", {
        lat: lat,
        lng: lng,
      });

      setUserLocation({ lat, lng });
      console.log("Selected address location:", lat, lng);

      setLocationSelected(true);
      setShowLocationModal(false);

      // Fetch nearby workers
      await fetchNearbyWorkers(lat, lng);
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location. Please try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  // Filtering & Sorting Logic
  useEffect(() => {
    if (!locationSelected || workers.length === 0) {
      setFilteredWorkers([]);
      return;
    }

    let result = [...workers];

    // Job filter - check if the selected job matches any of the worker's skills
    if (jobFilter !== "all") {
      result = result.filter((w) =>
        w.allSkills.some(
          (skill) => skill.toLowerCase() === jobFilter.toLowerCase()
        )
      );
    }

    // Price filter
    result = result.filter(
      (w) => w.price >= priceRange[0] && w.price <= priceRange[1]
    );

    // Sorting
    if (sortBy === "distance" && userLocation) {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredWorkers(result);
  }, [jobFilter, priceRange, sortBy, locationSelected, workers, userLocation]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Choose Your Location
              </h2>
              <p className="text-gray-600">
                Select location to find nearby workers
              </p>
            </div>

            {/* Current Location Button */}
            <button
              onClick={handleCurrentLocation}
              disabled={loadingLocation}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition mb-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingLocation ? (
                <>
                  <span className="animate-spin">⏳</span> Getting Location...
                </>
              ) : (
                <>
                   Use Current Location
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Saved Addresses */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                SAVED ADDRESSES
              </h3>
              {savedAddresses.map((address) => (
                <button
                  key={address._id}
                  onClick={() => handleSavedAddress(address)}
                  disabled={loadingLocation}
                  className="w-full text-left p-4 border mb-3 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏠</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {address.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {`${address.landmark}, ${address.street}, ${address.city}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Workers Modal */}
      {loadingWorkers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4 animate-bounce">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Fetching Nearby Workers
            </h2>
            <p className="text-gray-600">Please wait a moment...</p>
            <div className="mt-6">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={
          locationSelected && !loadingWorkers
            ? ""
            : "opacity-30 pointer-events-none"
        }
      >
        <div className="flex justify-between">
          <div className="text-4xl text-green-500 font-bold mb-6">
            Find Local Help Near You
          </div>
          <div>
            <ProfileDropDown />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <select
            className="p-3 border rounded-lg"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="AC & Appliances Repair">
              AC & Appliances Repair
            </option>
            <option value="Home Cleaning">Home Cleaning</option>
            <option value="Chef">Chef / Cook</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Painter">Painter</option>
          </select>

          <div>
            <label className="block mb-1">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full"
            />
          </div>

          <select
            className="p-3 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="distance">Nearest First</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating</option>
          </select>

          <button
            onClick={() => setShowLocationModal(true)}
            className="bg-blue-600 text-white text-xl font-bold px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            📍 Change Location
          </button>
        </div>

        {/* Worker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{worker.name}</h3>
                  <p className="text-gray-600">{worker.job}</p>
                  {/* Display all skills if more than one */}
                  {worker.allSkills.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.allSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  ★ {worker.rating} ({worker.reviews})
                </span>
              </div>

              <p>
                <strong>Exp:</strong> {worker.experience}
              </p>
              <p>
                <strong>Area:</strong> {worker.location.area}
              </p>
              {worker.distance > 0 && (
                <p className="text-blue-600 font-semibold">
                  ~{(worker.distance* 0.001).toFixed(2)} km away
                </p>
              )}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold">₹{worker.price}</span>
                  <span className="text-gray-500 text-sm">
                    {" "}
                    {worker.priceUnit}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigate(`/services/${worker.job}/confirm-booking`, {
                      state: { workerDetails: worker },
                    });
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkers.length === 0 &&
          locationSelected &&
          !loadingWorkers && (
            <p className="text-center text-gray-500 text-xl mt-10">
              No workers found for selected filters.
            </p>
          )}
      </div>
    </div>
  );
}
