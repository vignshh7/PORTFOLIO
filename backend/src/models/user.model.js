import mongoose , {Schema} from "mongoose";


const userSchema = new Schema (
    {
        username:{
            type: String,
            required: true,
            trim: true
        },

        password:{
            type: String,
            required: true
        }
    },
    {
        timestamp: true
    }
)


export const User=  mongoose.model("User",userSchema);