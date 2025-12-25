const Provider = require("../models/Provider.model");
const response = require("../utils/responseHandler");
const Booking = require("../models/Booking.model")
const updateProfile = async (req, res) => {
  try {
    const { skills, document, vehicle, experience } = req.body;
    console.log("Update profile called with:", req.body);
    console.log(vehicle.type, vehicle.number);
    const providerId = req.user._id;

    let provider = await Provider.findOne({ providerId: providerId });
    // UPDATE
    if (skills) provider.skills = skills;
    if (document) provider.document = document;
    if (vehicle) provider.vehicle = vehicle.type;
    if (vehicle) provider.vehicleNumber = vehicle.number;

    // if (vehicle) provider.vehicleNumber = vehicle.number;
    if (experience !== undefined) provider.experience = experience;

    await provider.save();

    return response(
      res,
      200,
      "Completed Provider profile  successfully",
      provider
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const createProfile = async (req, res) => {
  const { lat, lng } = req.body;
  const providerId = req.user._id;
  let existingProvider;
  if (!lat || !lng) {
    return response(res, 400, "Latitude and Longitude required");
  }

  try {
    if (providerId) {
      console.log("create profile called for provider:", providerId);
      existingProvider = await Provider.findOne({ providerId: providerId });
      if (!existingProvider) {
        const newProvider = await Provider.create({
          providerId: providerId,
          currentLocation: {
            type: "Point",
            coordinates: [lng, lat],
            lastlocationUpdate: new Date(),
          },
        });
        if (newProvider) {
          response(
            res,
            200,
            "Provider profile created successfully",
            newProvider
          );
        }
      }
      existingProvider.currentLocation = {
        type: "Point",
        coordinates: [lng, lat],
        lastlocationUpdate: new Date(),
      };
      await existingProvider.save();
      return response(
        res,
        200,
        "Provider profile updated successfully",
        existingProvider
      );
    } else {
      return response(res, 400, "Provider not logged in");
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Server Error During Login");
  }
};

3;
const toggleAvalability = async (req, res) => {
  try {
    console.log("Toggling availability to:", req.body);

    const { isAvaliable } = req.body;
    const provider = await Provider.findOneAndUpdate(
      { providerId: req.user._id },
      { $set: { isAvailable: !isAvaliable } },
      { new: true }
    );
    if (!provider) {
      return response(res, 404, "Provider Not Found");
    }
    return response(res, 200, "Updated Avalability", provider);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
const getNearbyProviders = async (req, res) => {
  const { lat, lng } = req.query;
  console.log(lat, lng);
  try {
    if (!lat || !lng) {
      return response(res, 400, "Latitude and Longitude required");
    }
    const providers = await Provider.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          key: "currentLocation",
          distanceField: "distance",
          maxDistance: 10000,
          spherical: true,
          query: { isAvailable: true },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,

          // 👤 User info
          "user._id": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.phone": 1,

          // 🧑‍🔧 Provider info
          skills: 1,
          experience: 1,
          rating: 1,
          totalRatings: 1,
          totalCompletedOrders: 1,
          vehicle: 1,

          // 📍 Location & distance
          currentLocation: 1,
          distance: { $round: ["$distance", 2] },
        },
      },
    ]);
    console.log(providers);
    return response(
      res,
      200,
      "Nearby Provider fetched Successfully",
      providers
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error ");
  }
};

const getmyjobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find provider linked to this user
    const provider = await Provider.findOne({ providerId: userId });

    if (!provider) {
      return response(res, 404, "Provider profile not found");
    }

 

    // 3️⃣ Fetch jobs assigned to provider
    const jobs = await Booking.find({
      providerId: provider._id
    })
      .populate("userId", "firstName lastName phone")
      .sort({ createdAt: -1 });

    return response(res, 200, "Jobs fetched successfully", jobs);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};



const getprovider = async (req, res) => {
  const providerId = req.user._id;
  let provider;
  try {
    provider = await Provider.findOne({ providerId: providerId });
    if (!provider) {
      return response(res, 404, "Provider Not Found");
    }
    return response(res, 200, "Provider fetched successfully", provider);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const modifystatus = async (req, res) => {
    const {currentstatus}=req.body;
    console.log(currentstatus)
  try {
    const providerUserId = req.user._id;
    const { bookingId } = req.params;

    const provider = await Provider.findOne({ providerId: providerUserId });
    if (!provider) {
      return response(res, 404, "Provider not found");
    }
   console.log("ProviderId",providerUserId),
   console.log("BookingId",bookingId);
  
    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
      },
      { status: currentstatus },
      { new: true }
    );

    if (!booking) {
      return response(res, 404, "Booking not found or already accepted");
    }
 

    
    await provider.save();
    return response(res, 200, "Job accepted successfully", booking);

  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};


module.exports = {
  updateProfile,
  toggleAvalability,
  createProfile,
  getprovider,
  getNearbyProviders,
  getmyjobs,
  modifystatus
};
