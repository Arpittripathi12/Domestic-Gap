const response = require("../utils/responseHandler");
const User = require("../models/User.model");
const sendOtpToEmail = require("../utils/emailService");
const otpGenerate = require("../utils/otpGenerator");
const OTP = require("../models/Otp.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/Generatetoken");
const Booking = require("../models/Booking.model");
const upload = require("../middlewares/upload");
const {OAuth2Client}=require("google-auth-library")
const axios =require("axios");
const sendOtp = async (req, res) => {
const { email } = req.body;



  const otp = otpGenerate();
  let user;
  let verified;
  try {
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        verified = await OTP.create({ email, otp });

        sendOtpToEmail(email, otp);
        return response(res, 200, "OTP send to email", { email });
      } else {
        return response(
          res,
          300,
          "Email already registered Please Login to Continue",
          { email }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const verifyOtp = async (req, res) => {
  const { password, firstName, lastName, email, otp, role } = req.body;
  let user;
  let toverify;
  try {
    if (email) {
      toverify = await OTP.findOne({ email });

      if (!toverify) {
        return response(res, 404, "User not found");
      }
      if (toverify.otp === otp) {
        // Save User details to database
        const saltround = 10;
        const hashedPassword = await bcrypt.hash(password, saltround);
        user = await User.create({
          email: email,
          firstName: firstName,
          lastName: lastName || "",
          password: hashedPassword,
          role: role,
          authProvider:{
            local:true,
          }
        });
        // generate jwt token
        const token = generateToken(user._id);
       res.cookie("auth_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",      // must be true in production (HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookies
})
        return response(res, 200, "Verified-Successfully", { token, user });
      } else {
        return response(res, 401, "Incorrect Otp");
      }
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const updateAddress = async (req, res) => {
  const { address } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    // If new address is marked default → remove previous default
    if (address && user.role === "user") {
      if (address.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
      }
      // Push New Address
      user.addresses.push({
        label: address.label,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        pincode: address.pincode,
        state: address.state,
        location: {
          type: "Point",
          coordinates: address.location.coordinates,
        },
        isDefault: address.isDefault,
      });
    }

    await user.save();
    return response(res, 200, "Profile Updated Successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const updateProfileOtp = async (req, res) => {
  const userId = req.userId;

  const otp = otpGenerate();
  let user;
  let verified;
  try {
    if (userId) {
      user = await User.findById(userId);

      if (user) {
        verified = await OTP.create({ email: user.email, otp });
        verified.save();
        sendOtpToEmail(user.email, otp);
        return response(res, 200, "OTP send to email", { email: user.email });
      } else {
        return response(res, 300, "Email does not registerd with Domestic-Gap");
      }
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const updateProfile = async (req, res) => {
  let user;
  try {
    const { firstName, lastName, phone, newpassword, otp } = req.body;
    const userId = req.userId;
    console.log("OTP IS ...........",otp)
    user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "User not found");
    }

    const toverify = await OTP.findOne({ email: user.email });
    if (!toverify) {
      return response(res, 404, "OTP not found");
    }
    
    if (toverify.otp !== otp) {
      return response(res, 401, "Incorrect OTP");
    }

    // ✅ OTP verified — clear it
    toverify.otp = null;

    // ✅ Update fields only if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    // ✅ Correct password check
    if (newpassword && newpassword.trim().length > 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
      user.password = hashedPassword;
    }

    const token = generateToken(user._id);
    res.cookie("auth_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",      // must be true in production (HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookies
})
    await user.save();

    return response(res, 200, "Profile Updated Successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error", user);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user;
  if (email && password) {
    try {
      user = await User.findOne({ email });

      if (!user) {
        return response(res, 401, "Email does not exist");
      }
      if(user.authProvider.local===false){
        user.set('authProvider.local',true);
        await user.save();
      }
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = generateToken(user._id);
        res.cookie("auth_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",      // must be true in production (HTTPS)
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookies
})
        return response(res, 200, "Login Successfull", {
          role: user.role,
          user,
        });
      }
      return response(res, 402, "Password is Incorrect", { email });
    } catch (error) {
      console.error(error);
      return response(res, 500, "Server Error During Login");
    }
  } else {
    return response(res, 500, "Email and Password is Required");
  }
};

const updateCurrentLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return response(res, 401, "User not logged in");
    }

    if (lat == null || lng == null) {
      return response(res, 400, "Latitude and Longitude required");
    }

    await User.findByIdAndUpdate(userId, {
      currentLocation: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    return response(res, 200, "Current Location Updated Successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const logout = async (req, res) => {
  try {
res.cookie("auth_token", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(0)
});
    return response(res, 200, "Logged out Successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const globaluser = async (req, res) => {
  return response(res, 200, "User fetched successfully", { user: req.user });
};


const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return response(res, 400, "User not found");
    }


    const jobs = await Booking.find({ userId })
      .populate({
        path: "providerId",
        select: "skills experience rating phone",
        populate: {
          path: "providerId",
          select: "firstName lastName"
        }
      })
      .sort({ createdAt: -1 });

    return response(res, 200, "Jobs fetched successfully", jobs);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

const cancelbooking=async(req,res)=>{
  const {bookingId}=req.body;
  const userId=req.user._id;
  try {
    if(userId){
      const booking=await Booking.findOneAndUpdate({
        userId:userId ,
        bookingId:bookingId,
      },
      {
        status:"cancelled"
      },
      {new:true}
    
    )
      return response(res,200,"Booking Cancelled Successfully",booking)
    }
    else{
      return response(res,400,"User not found");
    }
  } catch (error) {
    
  }
}

const uploadProfilePicture=async(req,res)=>{
    const userId=req.user._id;

  try {
    const imageUrl=req.file.path;
    const user=await User.findByIdAndUpdate(
       userId,
       {profileImage:imageUrl},
       {new:true}
    );
    return response(res,200,"Profile Picture Updated Successfully",imageUrl);
  } catch (error) {
    console.error("THE ERROR IN UPLOADING IMAGE ",error);
    return response(res,500,"Internal Server Error");
  }
}
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const googleSignIn=async(req,res)=>{
//   try {
//     const {idToken,role}=req.body;
//     if(!role){
//       return response(res,400,"Role is Required");
//     }
//     const ticket= await client.verifyIdToken({
//       idToken,  
//       audience:process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload=ticket.getPayload();
//     const {email,given_name,family_name,profileImage}=payload;

//     let user= await User.findOne({email});


//     if(!user){
//       user=await User.create({
//         firstName:given_name,
//         lastName:family_name,
//         email:email,
//         profileImage:profileImage,
//         role,
//         authProvider:"google",
//       });
//       console.log("NEW USER CREATED VIA GOOGLE SIGN IN",user);
//     }

//     const token=generateToken(user._id);
//     res.cookie("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",      // must be true in production (HTTPS)
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookies
//     })
//     return response(res,200,"Google Login Successfull",user)

//   } catch (error) {
//     console.error(error);
//     return response(res,500,"Google Sign-In Failed");
//   }
// }

const googleSignIn=async(req,res)=>{
  try {
    const {accessToken,role}=req.body;
    if(!accessToken){
      return response(res,400,"Access Token Missing");
    }
   
    // GET USER INFO
    const googleRes=await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      }
    );

    const {email,name,profileImage,sub}=googleRes.data;

    let user =await User.findOne({email});
    if(user){
      console.log("EXISTING USER LOGGING IN VIA GOOGLE SIGN IN",user);  
      const token=generateToken(user._id);
      res.cookie("auth_token",token,{
        secure:process.env.NODE_ENV==="production",
        httpOnly:true,
        sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
      });
     console.log("TOKEN",token);

      if(user.authProvider?.google===false){
      user.set('authProvider.google',true);
      await user.save();
      }
      return response(res,200,"GOOGLE LOGIN SUCCESSFULL",user);
    }
    
   if(!role){
      return response(res,400,"Role is required for signup");
    }
    const fullName=name?.trim()||"";
    const [firstName,...lastNameParts]=fullName.split(" ");
    const lastName=lastNameParts.join(" ")||null;
   
    


      user=await User.create({
        email,
        firstName:firstName,
        lastName:lastName,
        profileImage,
        googleId : sub,
        role,
        authProvider:{
          google:true
        }
      })
    console.log("NEW USER CREATED VIA GOOGLE SIGN IN",user);
    const token=generateToken(user._id);
    res.cookie("auth_token",token,{
      secure:process.env.NODE_ENV==="production",
      httpOnly:true,
      sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
    })
    return response(res,201,"Signup successfull",user);
  } catch (error) {
    console.error(error);
    return response(res,500,"Google Sign in Failed")
  }
}
module.exports = {
  googleSignIn,
  cancelbooking,
  sendOtp,
  verifyOtp,
  updateAddress,
  login,
  logout,
  globaluser,
  updateProfileOtp,
  updateProfile,
  updateCurrentLocation,
  getMyBookings,
  uploadProfilePicture,
};
