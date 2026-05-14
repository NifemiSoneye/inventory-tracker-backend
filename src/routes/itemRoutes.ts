import express from "express";
import {
  getAllItems,
  getItemById,
  createNewItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";

const router = express.Router();

router.route("/").get(getAllItems).post(createNewItem);

router.route("/:id").get(getItemById).patch(updateItem).delete(deleteItem);

export default router;
