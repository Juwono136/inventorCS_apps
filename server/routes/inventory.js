import express from "express";
import { auth } from "../middleware/auth.js";
import { authAdminOrStaff } from "../middleware/authAdminOrStaff.js";
import { createInventory, deleteInventory, getAllInventories, updateInventory } from "../controllers/inventory.js";

const router = express.Router()

router.get('/all_inventories', getAllInventories)

router.post("/add_inventory", auth, authAdminOrStaff, createInventory)

router.patch("/update_inventory/:id", auth, authAdminOrStaff, updateInventory)
// router.patch("/draft_inventory/:id", auth, authAdminOrStaff, draftInventory)

router.delete("/delete_inventory/:id", auth, authAdminOrStaff, deleteInventory)

export default router