const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: [{ type: String }],

    experience: {
      type: Number,
      default: 0,
    },

    document: {
      aadhar: {
        type: String,
        default: "",
      },
    },

    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalCompletedOrders: { type: Number, default: 0 },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: "2dsphere",
      },
      lastLocationUpdate: Date,
    },

    isAvailable: { type: Boolean, default: true },

    todayEarnings: { type: Number, default: 0 },
    todayOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },

    vehicle: { type: String, default: "" },
    vehicleNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

ProviderSchema.index({ currentLocation: "2dsphere" });
ProviderSchema.index({ isAvailable: 1 });

module.exports  = mongoose.model("Provider", ProviderSchema);
