import express from "express";


const app= express(); //express app
app.use(express.json());

//routes import
import userRouter from "./routes/user.routes.js";



//routes declaration

//http:://localhost:4000/api/v1/users/login
app.use("/api/v1/users", userRouter)


export default app;
