const express=require("express");
const router=express.Router();
const authMiddleware=require("../middlewares/authmiddleware");
const providerController=require("../controllers/provider.controller")

router.put("/complete-profile",authMiddleware,providerController.updateProfile);
router.post("/create-profile",authMiddleware,providerController.createProfile);
router.get("/getprovider",authMiddleware,providerController.getprovider);
router.post("/avaliability",authMiddleware,providerController.toggleAvalability);
router.get("/nearby-providers",authMiddleware,providerController.getNearbyProviders);
router.get("/my-jobs",authMiddleware,providerController.getmyjobs);
router.post("/accept-job/:bookingId",authMiddleware,providerController.modifystatus);


module.exports=router;  