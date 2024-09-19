import express from "express";
import { auth } from "../middleware/auth.js";
import { createInventory, getAllInventories } from "../controllers/inventory.js";
import { authAdminOrStaff } from "../middleware/authAdminOrStaff.js";

const router = express.Router()

router.post("/add_inventory", auth, authAdminOrStaff, createInventory)

router.get('/all_inventories', getAllInventories)

export default router