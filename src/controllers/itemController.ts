import Item from "../model/Item";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const getAllItems = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { search, category, status } = req.query;
    const query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (status) query.status = status;
    const items = await Item.find(query).lean();
    res.json(items); // returns [] when empty, RTK Query handles it fine
  },
);

const createNewItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, category, quantity, price } = req.body;
    if (!name || !category || quantity === undefined || !price) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }
    const duplicate = await Item.findOne({ name }).lean().exec();

    if (duplicate) {
      res.status(409).json({
        message: "Duplicate Item name",
      });
      return;
    }

    const deriveStatus = (quantity: number): string => {
      if (quantity === 0) return "Out of stock";
      if (quantity <= 5) return "Low stock";
      return "In stock";
    };
    const itemObject = {
      name,
      category,
      quantity,
      price,
      status: deriveStatus(quantity),
    };

    const item = await Item.create(itemObject);

    if (item) {
      res.status(201).json({ message: `New Item ${name} created`, item });
    } else {
      res.status(400).json({ message: "Invalid Item data recieved" });
    }
  },
);

const getItemById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Item ID required",
      });
      return;
    }
    const item = await Item.findById(id).exec();

    if (!item) {
      res.status(404).json({
        message: "Item not found",
      });
      return;
    }
    res.json(item);
  },
);

const updateItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    if (!name || !category || quantity === undefined || !price) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const item = await Item.findById(id).exec();
    if (!item) {
      res.status(404).json({
        message: "Item not found",
      });
      return;
    }
    const duplicate = await Item.findOne({ name }).lean();

    if (duplicate && duplicate?._id.toString() !== id) {
      res.status(409).json({
        message: "Duplicate Title",
      });
      return;
    }
    const deriveStatus = (quantity: number): string => {
      if (quantity === 0) return "Out of stock";
      if (quantity <= 5) return "Low stock";
      return "In stock";
    };

    item.name = name;
    item.category = category;
    item.quantity = quantity;
    item.price = price;
    item.status = deriveStatus(quantity);

    const updatedItem = await item.save();
    res.json({ message: `${updatedItem.name} updated` });
  },
);

const deleteItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Item ID required",
      });
      return;
    }
    const item = await Item.findById(id).exec();

    if (!item) {
      res.status(404).json({
        message: "Item not found",
      });
      return;
    }

    const result = await item?.deleteOne();

    res.json(`Item ${item?.name} with ID ${id} deleted`);
  },
);

export { getAllItems, createNewItem, getItemById, updateItem, deleteItem };
