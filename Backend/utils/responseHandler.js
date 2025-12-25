const response=(res,statusCode,message,data=null)=>{
    if(!res){
        console.log("Response object is null");
        return;        
    }
    const responseObj={
        status:statusCode,
        message,
        data
    }
    return res.status(statusCode).json(responseObj)
}
module.exports=response;