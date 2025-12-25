const express=require("express");
const router=express.Router();
const authMiddleware=require("../middlewares/authmiddleware");
const bookingController=require("../controllers/booking.controller");

router.post("/confirm-booking",authMiddleware,bookingController.confirmBooking);

module.exports=router;