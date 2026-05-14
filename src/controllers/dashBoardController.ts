import Item from "../model/Item";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const getDashBoardStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const totalProductCount = await Item.countDocuments();

    const lowStockCount = await Item.countDocuments({
      quantity: { $gt: 0, $lte: 5 },
    });
    const noStockCount = await Item.countDocuments({
      quantity: 0,
    });

    const categories = await Item.distinct("category"); // ["Electronics", "Furniture", "Clothing"]
    const uniqueCategoryCount = categories.length;

    res.json({
      totalProductCount,
      lowStockCount,
      noStockCount,
      uniqueCategoryCount,
    });
  },
);

export default getDashBoardStats;
