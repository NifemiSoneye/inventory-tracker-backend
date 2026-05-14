import express from "express";
import getDashBoardStats from "../controllers/dashBoardController";

const router = express.Router();

router.route("/").get(getDashBoardStats);

export default router;
