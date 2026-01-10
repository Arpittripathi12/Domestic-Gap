const express=require("express");
const authController=require("../controllers/auth.controller");
const authMiddleware=require("../middlewares/authmiddleware");
const serviceController=require("../controllers/service.controller");
const upload=require("../middlewares/upload");
const router=express.Router();


router.post('/send-otp',authController.sendOtp);
router.post('/verify-otp',authController.verifyOtp);
router.put('/update-address',authMiddleware,authController.updateAddress);
router.post("/login",authController.login);
router.get("/logout",authController.logout);
router.get("/me", authMiddleware,authController.globaluser);
router.post("/upload-profile",authMiddleware,upload.single("profileImage"),authController.uploadProfilePicture)
router.get("/updateprofile-otp",authMiddleware,authController.updateProfileOtp);
router.put("/updateprofile-data",authMiddleware,authController.updateProfile);
router.post("/location/update",authMiddleware,authController.updateCurrentLocation);
router.get("/getmybookings",authMiddleware,authController.getMyBookings);
router.post("/cancelbooking",authMiddleware,authController.cancelbooking);
router.post("/location/reverse", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "DomesticGapApp/1.0(contact@domesticgap.com)",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

module.exports=router;  