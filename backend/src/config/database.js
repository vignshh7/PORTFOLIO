import mongoose from "mongoose";


const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected!\n ${connectionInstance.connection.host}`);
        return connectionInstance.connection;
    } catch (error) {
        console.log(`connection error!`, error);
        console.log("MONGO_URI =", process.env.MONGO_URI);
        throw error;
    }
};


export default connectDB;