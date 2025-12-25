const express=require("express");
const authController=require("../controllers/auth.controller");
const authMiddleware=require("../middlewares/authmiddleware");
const serviceController=require("../controllers/service.controller");
const router=express.Router();


router.post('/send-otp',authController.sendOtp);
router.post('/verify-otp',authController.verifyOtp);
router.put('/update-address',authMiddleware,authController.updateAddress);
router.post("/login",authController.login);
router.get("/logout",authController.logout);
router.get("/me", authMiddleware,authController.globaluser);
router.get("/updateprofile-otp",authMiddleware,authController.updateProfileOtp);
router.put("/updateprofile-data",authMiddleware,authController.updateProfile);
router.post("/location/update",authMiddleware,authController.updateCurrentLocation);
router.get("/getmybookings",authMiddleware,authController.getMyBookings);
router.post("/cancelbooking",authMiddleware,authController.cancelbooking);
router.post("/location/reverse",async (req, res) => {
  const { lat, lng } = req.body;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
   
  );

  const data = await response.json();
  res.json(data);
});
module.exports=router;  