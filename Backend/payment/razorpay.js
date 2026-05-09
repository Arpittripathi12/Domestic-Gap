const  response  = require("../utils/responseHandler");
const Razorpay=require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET
})

const makepayment=async(req,res)=>{
  const{amount,receiptId}=req.body;
  const amountInPaise = Number(amount);

  try {
    const options={
    amount:amountInPaise*100,
    currency:"INR",
    receipt:receiptId,
  }
  const order=await razorpayInstance.orders.create(options);
  console.log("PAyMENT",order);
  return response(res,200,"Payment Success",order);
  } catch (error) {
     return response(res,500,"Payment Failed",error);
  }
  
}
module.exports={makepayment};