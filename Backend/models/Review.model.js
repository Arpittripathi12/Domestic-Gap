const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,

    categories: {
    punctuality: Number,
    quality: Number,
    behavior: Number,
  },
    
    providerResponse: {
    comment: String,
    respondedAt: Date,
  }


  },
  { timestamps: true }
);

ReviewSchema.index({ providerId: 1, rating: 1 });
ReviewSchema.index({ bookingId: 1 }, { unique: true }); // One review per booking

module.exports = mongoose.model("Review", ReviewSchema);
