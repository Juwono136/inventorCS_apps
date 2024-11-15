import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { createInventory, deleteInventory, getAllInventories, getInventoryById, updateInventory } from "../controllers/inventory.js";

const router = express.Router()

router.get('/all_inventories', getAllInventories)
router.get('/inventories/:id', getInventoryById)

router.post("/add_inventory", auth, authStaff, createInventory)

router.patch("/update_inventory/:id", auth, authStaff, updateInventory)
// router.patch("/draft_inventory/:id", auth, authAdminOrStaff, draftInventory)

router.delete("/delete_inventory/:id", auth, authStaff, deleteInventory)

export default router