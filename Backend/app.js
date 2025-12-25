// SHRI Ganeshay Namah

const express=require("express")
const dotenv=require("dotenv")
const connectDB=require("./config/db.js");
const app=express();
const cookieparser=require("cookie-parser")
const authRoute=require("./routes/authRoute.js")
const ProviderRoute=require("./routes/ProviderRoute.js")
const BookingRoute=require("./routes/BookingRoute.js")
const http=require("http");
const { Server } = require("socket.io");
const cors=require("cors")
dotenv.config();

const server=http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
require("./sockets/socket.js")(io);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));    
app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({extended:true}))

async function  run(){
 await connectDB();
 app.get("/",(req,res)=>{
    res.send("Hello World Clap");
});
}
run();

app.use("/api/auth",authRoute);
app.use("/api/provider",ProviderRoute);
app.use("/api/booking",BookingRoute);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));



