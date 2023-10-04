import express from "express";
import bodyParser from "body-parser";
import { config } from "./config/env.js";
import { authUser } from "./middleware/auth.js";
import authRoute from "./routes/auth_routes.js";
import adminRoute from "./routes/admin_route.js";
import studentRoute from "./routes/student_route.js";
import teacherRoute from "./routes/teacher_route.js";
import { errorHandler } from "./middleware/errorHandler.js";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.send("Welcome to the School API", req.url);
})


app.use("/auth", authRoute);
app.use(authUser);
app.use("/admin", adminRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);
app.use(errorHandler);
// 
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
