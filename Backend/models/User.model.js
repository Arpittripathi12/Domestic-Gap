const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },

    phone: { type: String },
    currentLocation: {
  type: {
    type: String,
    enum: ["Point"],
    
  },
  coordinates: {
    type: [Number],
    
  },
},

    addresses: [
      {
        label: {
          type: String,
          enum: ["Home", "Work", "Other"],
          default: "home",
        },
        street: String,
        landmark: String,
        city: String,
        pincode: String,
        state: String,

        location: {
          type: { type: String, default: "Point" },
          coordinates: [Number],
        },
        isDefault: { type: Boolean, default: false },
      },
    ],
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.index({ "addresses.location": "2dsphere" });
UserSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
