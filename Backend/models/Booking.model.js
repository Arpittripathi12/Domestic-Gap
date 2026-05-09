const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    // 🔹 WHO
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      default: null, // assigned later
    },

    // 🔹 WHAT (replaces Service model)
    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Cleaning", "Carpenter", "Painting","AC and Appliance Mechanic", "other"],
      required: true,
    },

    jobDescription: {
      type: String,
      required: true, // user explains the problem
    },

    // 🔹 BOOKING META
    bookingId: { type: String, unique: true},


    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },

   
    // urgency: {
    //   type: String,
    //   enum: ["normal", "urgent"],
    //   default: "normal",
    // },

    // 🔹 STATUS FLOW
    status: {
      type: String,
      enum: [
        "pending",      // waiting for provider
        "accepted",     // provider accepted
        "ontheway",     // provider on the way
        "reached",      // provider reached
        "in_progress",  // service started
        "completed",      // service completed
        "cancelled",    // cancelled
      ],
      default: "pending",
    },
    // 🔹 SERVICE LOCATION
    serviceAddress: {
      label: String,
      street: String,
      landmark: String,
      city: String,
      pincode: String,
      state: String,
      location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat]
      },
    },

    // 🔹 LIVE TRACKING
    tracking: {
      isActive: { type: Boolean, default: false },

      providerLocation: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },

      lastLocationUpdate: Date,

      distanceToDestination: Number,
      estimatedTimeOfArrival: Date,

      providerStartedAt: Date,
      providerReachedAt: Date,
      serviceStartedAt: Date,
      serviceCompletedAt: Date,
    },

    // 🔹 PRICING & PAYMENT
    price: {
      type: Number,
      required: true, // final agreed price
    },

    // pricingType: {
    //   type: String,
    //   enum: ["fixed", "hourly", "inspection_based"],
    //   default: "fixed",
    // },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "online", "wallet"],
    },


    // 🔹 OTP VERIFICATION
    otp: String,
    otpVerified: { type: Boolean, default: false },

    // 🔹 CANCELLATION
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: Date,

    // 🔹 TIMELINE (very important for UI)
      timeline: [
        {
          status: String,
          timestamp: Date,
          message: String,
        },
      ],
  },
  { timestamps: true }
);


BookingSchema.index({ "serviceAddress.location": "2dsphere" });
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ providerId: 1, status: 1 });
BookingSchema.index({ status: 1, scheduledDate: 1 });
BookingSchema.index({ category: 1, status: 1 });


// Generate unique booking ID before saving
BookingSchema.pre("save", function () {
  if (!this.bookingId) {
    this.bookingId =
      "ORD" +
      Date.now().toString().slice(-6) +
      Math.floor(100 + Math.random() * 900);
  }
});


module.exports = mongoose.model("Booking", BookingSchema);
