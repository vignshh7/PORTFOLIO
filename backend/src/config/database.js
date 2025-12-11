import mongoose from "mongoose";


const connectDB = async()=>{
    try {
      
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
          

        console.log(`MongoDB connected!\n ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log(`connection error!`,error);
        console.log("MONGO_URI =", process.env.MONGO_URI);

        process.exit(1);
    }
}


export default connectDB;