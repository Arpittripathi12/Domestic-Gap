import React, { useState,useRef, useEffect, useMemo ,useCallback} from "react";
import {
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle,
  X,
  MapPin,
  DollarSign,
  Calendar,
  Timer,
} from "lucide-react";
import ProfileDropDown from "./ProfileDropDown";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import MapView from "./Tracking/MapView";
import useLiveLocation from "./Tracking/useLiveLocation";
import socket from "./Tracking/socket";
const ProviderJobUI = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobStatus, setJobStatus] = useState("pending");
  const [newJobs, setNewJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, settrack] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [providerPos, setproviderPos] = useState({
    lng: 80.128108,
    lat: 27.405652 ,
  });
  const [userPos, setuserPos] = useState({
    lng: 0,
    lat: 0,
  });
  const selectedJobRef = useRef(null);

  let distanceKm;
  let etaMin;

  // Format distance from meters to km
  const formatDistance = (meters = 0) => {
    if (!meters) return "0 km";
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Format date + time
  const formatScheduledTime = (date, time) => {
    if (!date || !time) return "N/A";
    const d = new Date(date);
    const today = new Date();

    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    return isToday ? `Today ${time}` : `${d.toDateString()} ${time}`;
  };

  // Calculate time left from now
  const getTimeLeft = (scheduledDate, scheduledTime) => {
    if (!scheduledDate || !scheduledTime) return "";

    const [startTime] = scheduledTime.split(" - ");
    const jobDate = new Date(scheduledDate);
    const [hours, minutes] = startTime.split(":");

    jobDate.setHours(hours, minutes, 0, 0);

    const diffMs = jobDate - new Date();
    if (diffMs <= 0) return "Started";

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${diffHrs}h ${diffMins}m`;
  };

  // Fetch and transform jobs from API
  const fetchAndTransformJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/provider/my-jobs");
      console.log("API Response:", res);

      if (!res?.data?.data) {
        console.log("No data found");
        return [];
      }

      const transformedJobs = res.data.data.map((job, index) => {
        const address = job.serviceAddress || {};
        const tracking = job.tracking || {};

        return {
          id: job._id || index + 1,
          serviceType: job.category || "Service",
          userName:
            `${job.userId?.firstName || ""} ${
              job.userId?.lastName || ""
            }`.trim() || "Customer",
          distance: formatDistance(tracking.distanceToDestination),
          address:
            `${address.street || ""}, ${address.city || ""}`.trim() ||
            "Address not provided",
          estimatedPrice: `₹${job.price || 0}`,
          scheduledTime: formatScheduledTime(
            job.scheduledDate,
            job.scheduledTime
          ),
          timeLeft: getTimeLeft(job.scheduledDate, job.scheduledTime),
          phone: job.userId?.phone || "N/A",
          fullAddress:
            `${address.street || ""}, ${address.landmark || ""}, ${
              address.city || ""
            }, ${address.state || ""}`.trim() || "Address not provided",
          paymentMode: job.paymentMethod === "COD" ? "Cash" : "Online",
          instructions: job.jobDescription || "No instructions provided",
          status: job.status || "pending",
          rawData: job,
        };
      });

      return transformedJobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const osrmUrl = useMemo(() => {
    if (!providerPos || !userPos) return null;

    if (
      providerPos.lat === 0 ||
      providerPos.lng === 0 ||
      userPos.lat === 0 ||
      userPos.lng === 0
    )
      return null;

    return (
      `https://router.project-osrm.org/route/v1/driving/` +
      `${providerPos.lng},${providerPos.lat};` +
      `${userPos.lng},${userPos.lat}` +
      `?overview=full&geometries=geojson`
    );
  }, [providerPos, userPos]);

  const fetchingRoute = async () => {
    try {
      const res = await fetch(osrmUrl);
      const data = await res.json();

      if (!data?.routes?.length) return;

      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);

      distanceKm = (data.routes[0].distance / 1000).toFixed(2);
      etaMin = Math.ceil(data.routes[0].duration / 60);
      console.log(distanceKm, etaMin);
      setRouteCoords(coords); // ✅ store here
    } catch (error) {
      console.error("OSRM error:", error);
    }
  };

  useEffect(() => {
    if (!osrmUrl) return;

    fetchingRoute();
  }, [osrmUrl]);

  // Load jobs on component mount
  useEffect(() => {
    const loadJobs = async () => {
      const jobs = await fetchAndTransformJobs();

      // Separate jobs by status
      const pending = jobs.filter((job) => job.status === "pending");
      const active = jobs.filter((job) =>
        ["accepted", "ontheway", "reached", "in_progress"].includes(job.status)
      );
      const completed = jobs.filter((job) => job.status === "completed");

      setNewJobs(pending);
      setActiveJobs(active);
      setCompletedJobs(completed);
    };

    loadJobs();
  }, []);

  const handleAccept = async (job) => {
    try {
      console.log("CURRENT JOB", job);
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${job.id}`,
        {
          currentstatus: "accepted",
        }
      );
      const bookingId=response.data.data.bookingId
      console.log("ACCEPT REQUEST: ", bookingId);
      socket.emit("join-booking",{
        bookingId:bookingId,
        role:"provider"
      })
      
      setSelectedJob(job);
      setJobStatus("accepted");

      // Remove from new jobs and add to active jobs
      setNewJobs((prev) => prev.filter((j) => j.id !== job.id));
      setActiveJobs((prev) => [...prev, { ...job, status: "accepted" }]);
      setActiveTab("active");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to accept job. Please try again.");
    }
  };

  const handleReject = async (jobId) => {
    try {
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${jobId}`,
        {
          currentstatus: "rejected",
        }
      );
      console.log("REJECT REQUEST: ", response);

      setNewJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert("Job rejected");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to reject job. Please try again.");
    }
  };

  const handleStartNavigation = async (job) => {
    try {
      console.log("CURRENT JOB HERE ", job);
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${job.id}`,
        {
          currentstatus: "ontheway",
        }
      );
      console.log("RESPONSE ", response);

      console.log("ON THE WAY ........... ");
      setJobStatus("ontheway");
      updateJobInActiveList("ontheway");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleMarkReached = async (job) => {
    try {
      console.log("MARK AS REACHED .............");
      console.log("CURRENT JOB HERE ", job);
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${job.id}`,
        {
          currentstatus: "reached",
        }
      );
      console.log("RESPONSE ", response);

      setJobStatus("reached");
      updateJobInActiveList("reached");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to mark as reached. Please try again.");
    }
  };

  const handleStartWork = async () => {
    try {
      if (!selectedJob) return;

      console.log("STARTING WORK...");
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${selectedJob.id}`,
        {
          currentstatus: "in_progress",
        }
      );
      console.log("START WORK RESPONSE: ", response);

      setJobStatus("in_progress");
      updateJobInActiveList("in_progress");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to start work. Please try again.");
    }
  };

  const HandleTracking = async () => {
    settrack(true);
  };
 
  const handleCompleteWork = async () => {
    try {
      if (!selectedJob) return;

      setJobStatus("completed");
      updateJobInActiveList("completed");
    } catch (error) {
      console.log("Something Went Wrong ", error);
      alert("Failed to complete work. Please try again.");
    }
  };
  useEffect(() => {
  selectedJobRef.current = selectedJob;
}, [selectedJob]);


const onLocationUpdate = useCallback(
  (location) => {
    setproviderPos(location);
    
    if (!selectedJobRef.current) return; // ✅ check selectedJob instead
    console.log("SELECTED REF  ",selectedJobRef.current.id)
    console.log("SELECTED JOB ",selectedJob.rawData.bookingId)
    socket.emit("provider-location", {
      bookingId: selectedJob.rawData.bookingId, // ✅ use job id
      payload: {
        providerPos: location,
        routeCoords,
        distanceKm,
        etaMin,
      },
    });
  },
  [routeCoords, distanceKm, etaMin]
);

useLiveLocation(onLocationUpdate);
  

  const updateJobInActiveList = (status) => {
    if (selectedJob) {
      setActiveJobs((prev) =>
        prev.map((job) =>
          job.id === selectedJob.id ? { ...job, status } : job
        )
      );
      // Also update the selected job
      setSelectedJob((prev) => ({ ...prev, status }));
    }
  };

  const handleConfirmPayment = async () => {
    if (selectedJob) {
      console.log("COMPLETING WORK...");
      const response = await axiosInstance.post(
        `/api/provider/accept-job/${selectedJob.id}`,
        {
          currentstatus: "completed",
        }
      );
      console.log("COMPLETE WORK RESPONSE: ", response);
      // Move job to completed
      const completedJob = { ...selectedJob, status: "completed" };
      setCompletedJobs((prev) => [...prev, completedJob]);

      // Remove from active jobs
      setActiveJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));

      alert("Payment confirmed! Job moved to completed jobs.");
      setSelectedJob(null);
      setJobStatus("pending");
      setActiveTab("completed");
    }
  };

  useEffect(() => {
    if (!selectedJob) return;

    const servicelocation =
      selectedJob.rawData.serviceAddress.location.coordinates;
      setuserPos({
      lat: servicelocation[0],
      lng: servicelocation[1],
    });
    console.log("userPos", servicelocation);
  }, [selectedJob]);

  const renderJobCard = (job, showActions = true) => (
    <div
      key={job.id}
      className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{job.serviceType}</h3>
          <p className="text-gray-600">{job.userName}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600 text-lg">
            {job.estimatedPrice}
          </p>
          <p className="text-xs text-gray-500">Estimated</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          <span className="font-semibold mr-2">{job.distance}</span>
          <span className="text-gray-500">· {job.address}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
          <span>{job.scheduledTime}</span>
        </div>

        {showActions && job.timeLeft && job.timeLeft !== "Started" && (
          <div className="flex items-center text-sm">
            <Timer className="w-4 h-4 mr-2 text-orange-600" />
            <span className="text-orange-600 font-semibold">
              Accept within {job.timeLeft}
            </span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleAccept(job)}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Accept
          </button>
          <button
            onClick={() => handleReject(job.id)}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center"
          >
            <X className="w-5 h-5 mr-2" />
            Reject
          </button>
        </div>
      )}
    </div>
  );

  const renderJobDetail = () => {
    if (!selectedJob) return null;
    return (
     
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-2xl text-gray-800">
                {selectedJob.serviceType}
              </h2>
              <p className="text-gray-600 text-lg">{selectedJob.userName}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 text-2xl">
                {selectedJob.estimatedPrice}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  jobStatus === "accepted"
                    ? "bg-blue-100 text-blue-700"
                    : jobStatus === "ontheway"
                    ? "bg-yellow-100 text-yellow-700"
                    : jobStatus === "reached"
                    ? "bg-purple-100 text-purple-700"
                    : jobStatus === "in_progress"
                    ? "bg-orange-100 text-orange-700"
                    : jobStatus === "completed"
                    ? "bg-green-100 text-green-700"
                    : ""
                }`}
              >
                {jobStatus === "accepted"
                  ? "Accepted"
                  : jobStatus === "ontheway"
                  ? "On the Way"
                  : jobStatus === "reached"
                  ? "Reached"
                  : jobStatus === "in_progress"
                  ? "In Progress"
                  : jobStatus === "completed"
                  ? "Completed"
                  : ""}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Address</p>
              <p className="text-gray-800">{selectedJob.fullAddress}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-gray-800">{selectedJob.phone}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Mode</p>
              <p className="text-gray-800 font-semibold">
                {selectedJob.paymentMode}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Job Instructions</p>
              <p className="text-gray-800">{selectedJob.instructions}</p>
            </div>
          </div>

          {/* Map Placeholder */}

          {(jobStatus === "ontheway" || jobStatus === "reached") && (
            <div
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2  mb-4 text-center"
              onClick={() => HandleTracking()}
            >
              {track ? (
                <div className="">
                  <MapView
                    center={providerPos}
                    route={routeCoords}
                    providerPos={providerPos}
                    userPos={userPos}
                    distanceKm={distanceKm}
                    eta={etaMin}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 font-semibold">Map View</p>
                  <p className="text-sm text-gray-400">
                    Navigation map will be displayed here
                  </p>
                  {jobStatus === "ontheway" && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        Distance: {selectedJob.distance}
                      </p>
                      <p className="text-sm text-gray-600">ETA: 8 mins</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Work Timer */}
          {jobStatus === "in_progress" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 text-center">
              <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <p className="text-orange-700 font-semibold text-lg">
                Work in Progress
              </p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                00:15:32
              </p>
              <p className="text-sm text-gray-600 mt-1">Timer running</p>
            </div>
          )}

          {/* Completion Summary */}
          {jobStatus === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-center mb-4">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <p className="text-green-700 font-semibold text-lg">
                  Work Completed!
                </p>
              </div>
              <div className="border-t border-green-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Charge:</span>
                  <span className="font-semibold">
                    {selectedJob.estimatedPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Charges:</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-green-200 pt-2 mt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    {selectedJob.estimatedPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="text-orange-600 font-semibold">
                    {selectedJob.paymentMode === "Cash"
                      ? "Collect Cash ⚠️"
                      : "Paid Online ✓"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {jobStatus === "accepted" && (
              <button
                onClick={() => handleStartNavigation(selectedJob)}
                className="w-full bg-blue-600 mb-3 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center text-lg"
              >
                <Navigation className="w-6 h-6 mr-2" />
                Start Navigation
              </button>
            )}

            {jobStatus === "ontheway" && (
              <button
                onClick={() => handleMarkReached(selectedJob)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center text-lg"
              >
                <MapPin className="w-6 h-6 mr-2" />
                Mark as Reached
              </button>
            )}

            {jobStatus === "reached" && (
              <button
                onClick={handleStartWork}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center text-lg"
              >
                <Clock className="w-6 h-6 mr-2" />
                Start Work
              </button>
            )}

            {jobStatus === "in_progress" && (
              <button
                onClick={handleCompleteWork}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center text-lg"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Mark Work Completed
              </button>
            )}

            {jobStatus === "completed" && (
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center text-lg"
              >
                <DollarSign className="w-6 h-6 mr-2" />
                {selectedJob.paymentMode === "Cash"
                  ? "Confirm Cash Collected"
                  : "Finish Job"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-blue-100 text-sm">Manage your service requests</p>
        </div>
        <div>
          <ProfileDropDown />
        </div>
      </div>

      {!selectedJob ? (
        <>
          {/* Tabs */}
          <div className="bg-white shadow-sm sticky top-0 z-10">
            <div className="flex">
              <button
                onClick={() => setActiveTab("new")}
                className={`flex-1 py-3 font-semibold transition ${
                  activeTab === "new"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                New Requests ({newJobs.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-3 font-semibold transition ${
                  activeTab === "active"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                Active Jobs ({activeJobs.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 py-3 font-semibold transition ${
                  activeTab === "completed"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                Completed ({completedJobs.length})
              </button>
            </div>
          </div>

          {/* Job Lists */}
          <div className="p-4">
            {activeTab === "new" && (
              <div>
                {newJobs.length > 0 ? (
                  newJobs.map((job) => renderJobCard(job, true))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No new job requests</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "active" && (
              <div>
                {activeJobs.length > 0 ? (
                  activeJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        setJobStatus(job.status);
                      }}
                      className="cursor-pointer"
                    >
                      {renderJobCard(job, false)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No active jobs</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div>
                {completedJobs.length > 0 ? (
                  completedJobs.map((job) => renderJobCard(job, false))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No completed jobs</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4">
          <button
            onClick={() => setSelectedJob(null)}
            className="mb-4 text-blue-600 font-semibold flex items-center"
          >
            ← Back to Jobs
          </button>
          {renderJobDetail()}
        </div>
      )}
    </div>
  );
};

export default ProviderJobUI;
