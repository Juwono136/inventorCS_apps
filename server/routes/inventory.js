import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { checkUserProgram } from "../middleware/checkUserProgram.js";
import {
  activeInventory,
  createInventory,
  draftInventory,
  getAllInventories,
  getInventoriesByProgram,
  getInventoryById,
  updateInventory,
} from "../controllers/inventory.js";

const router = express.Router();

router.get("/all_inventories", getAllInventories);
router.get("/inventories/:id", getInventoryById);
router.get(
  "/all_inventories_by_program",
  auth,
  authStaff,
  checkUserProgram,
  getInventoriesByProgram
);

router.post("/add_inventory", auth, authStaff, checkUserProgram, createInventory);

router.patch("/update_inventory/:id", auth, authStaff, checkUserProgram, updateInventory);
router.patch("/draft_inventory/:id", auth, authStaff, checkUserProgram, draftInventory);
router.patch("/active_inventory/:id", auth, authStaff, checkUserProgram, activeInventory);

// router.delete("/delete_inventory/:id", auth, authStaff, deleteInventory)

export default router;
