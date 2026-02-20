import express from "express";
import cors from "cors";


const app= express(); //express app
app.use(express.json());

const allowedOrigins = [
	"http://localhost:5173",
	"https://portfolio-website-hglyuf5up-vigneshs-projects-ce61276c.vercel.app",
	"https://vigneshvenkatesan.vercel.app",
	process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin ||
				allowedOrigins.includes(origin) ||
				(origin && origin.endsWith(".vercel.app"))
			) {
				return callback(null, true);
			}
			return callback(new Error("Not allowed by CORS"));
		},
	})
);

//routes import
import userRouter from "./routes/user.routes.js";
import portfolioRouter from "./routes/portfolio.routes.js";
import resumeRouter from "./routes/resume.routes.js";



//routes declaration

//http:://localhost:4000/api/v1/users/login
app.use("/api/v1/users", userRouter)
app.use("/api/v1/portfolio", portfolioRouter)
app.use("/api/v1/resume", resumeRouter)


export default app;
