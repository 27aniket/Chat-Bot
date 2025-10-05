import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import cors from "cors"

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors());


// Test route
app.get('/', (req,res) => res.send('Server is Live!'));


//Routes
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);

console.log("Mongo URI on deployed server:", process.env.MONGODB_URI);
app.listen(process.env.PORT, () => {
    console.log(`Server is runing on PORT ${process.env.PORT}`);
    connectDB();
})



