const Booking = require("../models/Booking.model");
const response=require("../utils/responseHandler")
const confirmBooking = async (req, res) => {
    const { provider,jobDescription,scheduledDate,scheduledTime,serviceAddress,paymentMethod,finalPrice } = req.body;
   let booking;
   let userId=req.user._id;
    try {
        if(userId){
        booking = await Booking.create({
            userId:userId,
            providerId:provider.id,
            category:provider.job,
            jobDescription:jobDescription,
            scheduledDate:scheduledDate,
            scheduledTime:scheduledTime,
            status:"pending",
            serviceAddress:serviceAddress,
            paymentMethod:paymentMethod,
            price:finalPrice,
            paymentStatus:"pending",
            tracking:{
                isActive:true,
                distanceToDestination:provider.distance}

        })
        return response(res,200,"Booking Confirmed Succeesfully",booking)
    }else{
        return response(res,400,"User not found");
    }


    } catch (error) {
        console.error(error);
        return response(res,500,"Internal Server Error");
    }
}

module.exports={confirmBooking};