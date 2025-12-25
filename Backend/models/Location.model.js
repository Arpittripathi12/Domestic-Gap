const mongoose=require("mongoose");

const LocationHistorySchema=new mongoose.Schema({
    bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  
  timestamp: { type: Date, default: Date.now },
})

LocationHistorySchema.index({ location: "2dsphere" });
LocationHistorySchema.index({ bookingId: 1, timestamp: -1 });
LocationHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 }); 



module.exports=mongoose.model("LocationHistory", LocationHistorySchema)