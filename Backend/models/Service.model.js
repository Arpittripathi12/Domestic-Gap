const mongoose=require("mongoose");

const ServiceSchema=new mongoose.Schema({
    providerId:{type:mongoose.Schema.Types.ObjectId,ref:"Provider",required:true},
    title:{type:String,required:true},
    description:String,
    category: { 
    type: String, 
    enum: ["plumbing", "electrical", "cleaning", "carpentry", "painting", "other"],
    required: true 
  },
    isAvailable: { type: Boolean, default: true },

    price:{type:Number,required:true},
    duration:String,
    images:[String],
    rating:{type:Number, default:0},
    totalRatings: { type: Number, default: 0 }
},{timestamps:true})

ServiceSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.model("Service", ServiceSchema);
