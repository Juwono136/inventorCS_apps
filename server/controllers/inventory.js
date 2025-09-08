import Inventories from "../models/inventory.js";
import { customAlphabet } from "nanoid";
import { createLog } from "./historyLog.js";

// get All inventories info
export const getAllInventories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 16;
    const search = req.query.search || "";
    let sort = req.query.sort || "asset_name";
    let categories = req.query.categories || "All";

    const categoryOptions = [
      "Creative Tools",
      "Board Game",
      "IOT",
      "IOT Parts",
      "PC & Laptop",
      "Peripheral",
      "Others",
    ];

    const searchQuery = {
      draft: false,
      $or: [
        { asset_id: { $regex: search, $options: "i" } },
        { asset_name: { $regex: search, $options: "i" } },
        { serial_number: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { room_number: { $regex: search, $options: "i" } },
        { cabinet: { $regex: search, $options: "i" } },
      ],
    };

    if (categories.toLowerCase() !== "all") {
      categories = categories.split(",").map((cat) => cat.toLowerCase());
      searchQuery.categories = { $in: categories };
    }

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const inventories = await Inventories.find(searchQuery)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .lean();

    const totalItems = await Inventories.countDocuments(searchQuery);

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      page: page + 1,
      limit: limit,
      categories: categoryOptions,
      items: inventories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get inventory based on user program
export const getInventoriesByProgram = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    let sort = req.query.sort || "asset_name";
    let categories = req.query.categories || "All";
    const draftStatus = req.query.draftStatus || "";

    const categoryOptions = [
      "Creative Tools",
      "Board Game",
      "IOT",
      "IOT Parts",
      "PC & Laptop",
      "Peripheral",
      "Others",
    ];

    const userData = req.userData;

    const searchQuery = {
      item_program: userData.personal_info.program,
      $or: [
        { asset_id: { $regex: search, $options: "i" } },
        { asset_name: { $regex: search, $options: "i" } },
        { serial_number: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { room_number: { $regex: search, $options: "i" } },
        { cabinet: { $regex: search, $options: "i" } },
      ],
    };

    const draftOptions = new Set(draftStatus.split(",").filter(Boolean));

    if (draftOptions.size === 1) {
      if (draftOptions.has("Draft")) {
        searchQuery.draft = true;
      } else if (draftOptions.has("Active")) {
        searchQuery.draft = false;
      }
    }

    if (categories.toLowerCase() !== "all") {
      categories = categories.split(",").map((cat) => cat.toLowerCase());
      searchQuery.categories = { $in: categories };
    }

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const inventories = await Inventories.find(searchQuery)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .lean();

    if (!inventories) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const totalItems = await Inventories.countDocuments(searchQuery);

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      page: page + 1,
      limit: limit,
      categories: categoryOptions,
      items: inventories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get inventory by Id
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventories.findById(req.params.id).select("-added_by");

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.json(inventory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// create inventory
export const createInventory = async (req, res) => {
  const actorInfo = {
    actorId: req.user?._id || "SYSTEM", // use 'SYSTEM' if user is not defined
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    let inventories = req.body;

    const isArray = Array.isArray(inventories);
    if (!isArray) {
      inventories = [inventories];
    }

    // get all the item names you want to add
    const incomingNames = inventories.map((inv) => inv.asset_name.toLowerCase());

    // check the database for the same asset_name (case-insensitive)
    const existingInventories = await Inventories.find({
      asset_name: { $in: incomingNames.map((name) => new RegExp(`^${name}$`, "i")) },
    });

    const existingNames = existingInventories.map((inv) => inv.asset_name.toLowerCase());

    const validatedInventories = inventories
      .filter((inventory) => !existingNames.includes(inventory.asset_name.toLowerCase()))
      .map((inventory) => {
        const {
          asset_id,
          asset_name,
          asset_img,
          serial_number,
          categories,
          desc,
          location,
          room_number,
          cabinet,
          total_items,
          is_consumable,
          draft,
        } = inventory;

        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoid = customAlphabet(alphabet, 15);
        const newAssetId = nanoid(15);

        if (
          !asset_name ||
          !categories ||
          !desc ||
          !location ||
          !room_number ||
          !cabinet ||
          !total_items ||
          is_consumable === undefined
        ) {
          throw new Error("Please fill in the required fields.");
        }

        if (asset_name.length < 3) throw new Error("Item name is too short.");

        if (asset_name.length > 80) throw new Error("Item name cannot exceed 80 characters.");

        if (asset_id && asset_id.length > 15)
          throw new Error("Item ID cannot exceed 15 characters.");

        if (serial_number && serial_number.length > 40)
          throw new Error("Serial number cannot exceed 40 characters.");

        if (total_items < 0)
          throw new Error("Please input the total items with a positive number.");

        return {
          asset_id: newAssetId,
          asset_name,
          asset_img: asset_img || "https://api.dicebear.com/9.x/icons/svg?seed=Chase",
          serial_number: serial_number || "",
          item_program: req.userData.personal_info.program || "",
          desc,
          categories: categories.map((category) => category.toLowerCase()),
          location,
          room_number,
          cabinet,
          total_items,
          is_consumable,
          draft,
          added_by: req.user._id,
        };
      });

    if (validatedInventories.length === 0) {
      return res.json({
        message: "No new items were added because all provided items already exist.",
        inventories: [],
      });
    }

    let savedInventories;
    if (isArray) {
      savedInventories = await Inventories.insertMany(validatedInventories); // Batch Insert
    } else {
      savedInventories = await Inventories.create(validatedInventories[0]); // Single Insert
    }

    // LOGGING (SUCCESS)
    const logPromises = (
      Array.isArray(savedInventories) ? savedInventories : [savedInventories]
    ).map((inv) =>
      createLog({
        ...actorInfo,
        actionType: "CREATE_INVENTORY",
        entityType: "Inventory",
        entityId: inv._id.toString(),
        changes: {
          before: null, // there is no 'before' data as this is a new build.
          after: inv.toObject(), // new data saved
        },
        details: `New inventory item '${inv.asset_name}' was created.`,
        status: "SUCCESS",
      })
    );

    await Promise.all(logPromises);

    res.json({
      message: "Item(s) created successfully",
      inventories: savedInventories,
    });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "CREATE_INVENTORY",
      entityType: "Inventory",
      entityId: "N/A", // entity ID is not available because it failed to create
      details: "Attempt to create inventory failed.",
      status: "FAILURE",
      failureReason: error.message,
    });

    return res.status(500).json({ message: error.message });
  }
};

// update inventory
export const updateInventory = async (req, res) => {
  const inventoryId = req.params.id;

  const actorInfo = {
    actorId: req.user?._id || "SYSTEM",
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    const {
      asset_id,
      asset_name,
      asset_img,
      serial_number,
      desc,
      categories,
      location,
      room_number,
      cabinet,
      total_items,
      item_status,
      is_consumable,
      draft,
    } = req.body;

    if (asset_name && asset_name.length > 100) {
      return res.status(400).json({ message: "Item name cannot exceed 100 characters." });
    }

    if ((asset_name && asset_name.length < 3) || (asset_id && asset_id.lenght < 3)) {
      return res
        .status(400)
        .json({ message: "Item name or Item ID must be at least 3 letters long." });
    }

    if (asset_id && asset_id.length > 15) {
      return res.status(400).json({ message: "Item ID cannot exceed 15 characters." });
    }

    if (total_items < 0) {
      return res
        .status(400)
        .json({ message: "Please input the total items with positive number." });
    }

    if (!inventoryId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    // before state
    const existingInventory = await Inventories.findById(inventoryId).lean();

    if (!existingInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    const duplicateInventory = await Inventories.findOne({
      $or: [{ asset_id }],
      _id: { $ne: inventoryId },
    });

    if (duplicateInventory) {
      if (duplicateInventory.asset_id === asset_id) {
        return res.status(400).json({ message: "Asset ID already exists." });
      }
    }

    let formattedCategories = Array.isArray(categories)
      ? categories.map((cat) => cat.toLowerCase())
      : categories
      ? [categories.toLowerCase()]
      : existingInventory.categories;

    const updatedInventory = {
      asset_id: asset_id || existingInventory.asset_id,
      asset_name: asset_name || existingInventory.asset_name,
      asset_img: asset_img || existingInventory.asset_img,
      serial_number: serial_number || existingInventory.serial_number,
      desc: desc || existingInventory.desc,
      categories: formattedCategories,
      location: location || existingInventory.location,
      room_number: room_number || existingInventory.room_number,
      total_items: total_items || existingInventory.total_items,
      cabinet: cabinet || existingInventory.cabinet,
      item_status: item_status || existingInventory.item_status,
      draft: draft || existingInventory.draft,
      is_consumable: is_consumable || existingInventory.is_consumable,
      author: req.user._id,
    };

    // after state
    const result = await Inventories.findByIdAndUpdate({ _id: inventoryId }, updatedInventory, {
      new: true,
    }).lean();

    // LOGGING (SUCCESS)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      changes: {
        before: existingInventory,
        after: result,
      },
      details: `Inventory item '${result.asset_name}' was updated.`,
      status: "SUCCESS",
    });

    res.json({ message: "Update item success", result });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      details: "Attempt to update inventory failed.",
      status: "FAILURE",
      failureReason: error.message,
    });
    return res.status(500).json({ message: error.message });
  }
};

// update draft to active inventory
export const activeInventory = async (req, res) => {
  const inventoryId = req.params.id;

  const actorInfo = {
    actorId: req.user?._id || "SYSTEM",
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    const beforeState = await Inventories.findById(inventoryId).lean();

    if (!beforeState) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    const updateDraftInventory = await Inventories.findByIdAndUpdate(
      req.params.id,
      { draft: false },
      { new: true }
    ).lean();

    if (!updateDraftInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    // LOGGING (SUCCESS)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      changes: {
        before: beforeState,
        after: updateDraftInventory,
      },
      details: `Inventory item '${updateDraftInventory.asset_name}' status changed to active.`,
      status: "SUCCESS",
    });

    res.json({
      message: `${updateDraftInventory.asset_name} changes to active.`,
      inventory: updateDraftInventory,
    });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      details: "Attempt to change inventory status to active failed.",
      status: "FAILURE",
      failureReason: error.message,
    });

    return res.status(500).json({ message: error.message });
  }
};

// draft the inventory
export const draftInventory = async (req, res) => {
  const inventoryId = req.params.id;

  const actorInfo = {
    actorId: req.user?._id || "SYSTEM",
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    const beforeState = await Inventories.findById(inventoryId).lean();

    if (!beforeState) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    const updateDraftInventory = await Inventories.findByIdAndUpdate(
      req.params.id,
      { draft: true },
      { new: true }
    ).lean();

    if (!updateDraftInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    // LOGGING (SUCCESS)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      changes: {
        before: beforeState,
        after: updateDraftInventory,
      },
      details: `Inventory item '${updateDraftInventory.asset_name}' was marked as draft.`,
      status: "SUCCESS",
    });

    res.json({
      message: `${updateDraftInventory.asset_name} marked as draft.`,
      inventory: updateDraftInventory,
    });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "UPDATE_INVENTORY",
      entityType: "Inventory",
      entityId: inventoryId,
      details: "Attempt to mark inventory as draft failed.",
      status: "FAILURE",
      failureReason: error.message,
    });

    return res.status(500).json({ message: error.message });
  }
};

// request inventory deletion (by staff)
export const requestInventoryDeletion = async (req, res) => {
  const { inventoryIds } = req.body;

  const actorInfo = {
    actorId: req.user?._id || "SYSTEM",
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    const staffProgram = req.userData.personal_info.program;

    if (!inventoryIds || !Array.isArray(inventoryIds) || inventoryIds.length === 0) {
      return res.status(400).json({ message: "Inventory IDs must be a non-empty array." });
    }

    const itemsToUpdate = await Inventories.find({
      _id: { $in: inventoryIds },
      item_program: staffProgram,
      draft: false,
    }).lean();

    if (itemsToUpdate.length === 0) {
      return res.status(404).json({
        message: "No active items found for deletion in your program.",
      });
    }

    const idsToUpdate = itemsToUpdate.map((item) => item._id);

    await Inventories.updateMany(
      { _id: { $in: idsToUpdate } },
      {
        $set: {
          draft: true,
          deletion_requested_by: staffId,
        },
      }
    );

    // LOGGING (SUCCESS)
    const logPromises = itemsToUpdate.map((item) => {
      const afterState = { ...item, draft: true, deletion_requested_by: actorInfo.actorId };

      return createLog({
        ...actorInfo,
        actionType: "DELETE_INVENTORY_REQUEST",
        entityType: "Inventory",
        entityId: item._id.toString(),
        changes: {
          before: item,
          after: afterState,
        },
        details: `Deletion requested for item '${item.asset_name}'.`,
        status: "SUCCESS",
      });
    });

    await Promise.all(logPromises);

    res.json({
      message: `Request to delete has been sent. Waiting for admin approval.`,
      requested_count: idsToUpdate.length,
    });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "DELETE_INVENTORY_REQUEST",
      entityType: "Inventory",
      entityId: inventoryIds.join(", "),
      details: "Attempt to request inventory deletion failed.",
      status: "FAILURE",
      failureReason: error.message,
    });

    return res.status(500).json({ message: error.message });
  }
};

// approve and delete inventory (by admin)
export const approveInventoryDeletion = async (req, res) => {
  const { inventoryIds } = req.body;

  const actorInfo = {
    actorId: req.user?._id || "SYSTEM",
    actorName: req.user?.personal_info?.name || "Unknown",
    role: req.user?.personal_info?.role || [-1],
    ipAddress: req.ip,
  };

  try {
    const adminProgram = req.userData.personal_info.program;

    if (!inventoryIds || !Array.isArray(inventoryIds) || inventoryIds.length === 0) {
      return res.status(400).json({ message: "Inventory IDs must be a non-empty array." });
    }

    const itemsToDelete = await Inventories.find({
      _id: { $in: inventoryIds },
      item_program: adminProgram,
      draft: true,
    }).lean();

    if (itemsToDelete.length === 0) {
      return res.status(404).json({
        message: "No items matched the criteria for deletion.",
      });
    }

    const idsToDelete = itemsToDelete.map((item) => item._id);

    const deletionResult = await Inventories.deleteMany({ _id: { $in: idsToDelete } });

    // LOGGING (SUCCESS)
    const logPromises = itemsToDelete.map((item) =>
      createLog({
        ...actorInfo,
        actionType: "DELETE_INVENTORY_APPROVE",
        entityType: "Inventory",
        entityId: item._id.toString(),
        changes: {
          before: item,
          after: null,
        },
        details: `Item '${item.asset_name}' was permanently deleted.`,
        status: "SUCCESS",
      })
    );

    await Promise.all(logPromises);

    res.json({
      message: `Successfully deleted inventory item(s).`,
      deleted_count: deletionResult.deletedCount,
    });
  } catch (error) {
    // LOGGING (FAILURE)
    await createLog({
      ...actorInfo,
      actionType: "DELETE_INVENTORY_APPROVE",
      entityType: "Inventory",
      entityId: inventoryIds.join(", "),
      details: "Attempt to approve inventory deletion failed.",
      status: "FAILURE",
      failureReason: error.message,
    });

    return res.status(500).json({ message: error.message });
  }
};

// delete inventory
// export const deleteInventory = async (req, res) => {
//     try {
//         const inventory = await Inventories.findByIdAndDelete(req.params.id)

//         if (!inventory) {
//             return res.status(404).json({ message: "Inventory not found." })
//         }

//         res.json({ message: "Inventory item deleted." })
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

// Delete inventory that has been in draft status for 7 days (running automatically)
// export const deleteOldDrafts = async () => {
//     try {
//         // Search items that have draft status and more than 7 days old
//         const sevenDaysAgo = moment().subtract(7, 'days').toDate();
//         const inventoriesToDelete = await Inventories.find({
//             draft: true,
//             updatedAt: { $lt: sevenDaysAgo } // Use updatedAt field to find out when it was changed to draft.
//         });

//         // Delete items from database
//         if (inventoriesToDelete.length > 0) {
//             const deletePromises = inventoriesToDelete.map(item =>
//                 Inventories.findByIdAndDelete(item._id)
//             );
//             await Promise.all(deletePromises);
//             console.log(`${inventoriesToDelete.length} inventories permanently deleted.`);
//         } else {
//             console.log("No inventories to delete.");
//         }

//     } catch (error) {
//         console.error(`Error during cron job: ${error.message}`);
//     }
// };
