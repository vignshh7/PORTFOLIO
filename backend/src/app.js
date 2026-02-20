import express from "express";
import cors from "cors";


const app= express(); //express app
app.use(express.json());
app.use(cors());

//routes import
import userRouter from "./routes/user.routes.js";
import portfolioRouter from "./routes/portfolio.routes.js";



//routes declaration

//http:://localhost:4000/api/v1/users/login
app.use("/api/v1/users", userRouter)
app.use("/api/v1/portfolio", portfolioRouter)


export default app;
