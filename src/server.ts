import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import itemsRoutes from "./routes/itemRoutes";
import dashboardRoutes from "./routes/dahsboardRoute";
import RootRoutes from "./routes/root";
import connectDB from "./config/dbConn";
import { logEvents, logger } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import corsOptions from "./config/corsOptions";

const app = express();
const PORT = process.env.PORT || 3500;
connectDB();
app.use(logger);
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", RootRoutes);
app.use("/items", itemsRoutes);
app.use("/dashboard", dashboardRoutes);

app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t ${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log",
  );
});
