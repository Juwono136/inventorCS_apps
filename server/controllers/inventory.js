import Inventories from "../models/inventory.js";
import { nanoid, customAlphabet } from "nanoid";

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
  try {
    let inventories = req.body;

    const isArray = Array.isArray(inventories);
    if (!isArray) {
      inventories = [inventories];
    }

    const validatedInventories = inventories.map((inventory) => {
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
      if (asset_id && asset_id.length > 15) throw new Error("Item ID cannot exceed 15 characters.");
      if (serial_number && serial_number.length > 15)
        throw new Error("Serial number cannot exceed 15 characters.");
      if (total_items < 0) throw new Error("Please input the total items with a positive number.");

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
        added_by: req.user._id,
      };
    });

    let savedInventories;
    if (isArray) {
      savedInventories = await Inventories.insertMany(validatedInventories); // Batch Insert
    } else {
      savedInventories = await Inventories.create(validatedInventories[0]); // Single Insert
    }

    res.json({
      message: "Item created successfully",
      inventories: savedInventories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update inventory
export const updateInventory = async (req, res) => {
  try {
    const inventoryId = req.params.id;
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

    const existingInventory = await Inventories.findById(inventoryId);

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

    const result = await Inventories.findByIdAndUpdate({ _id: inventoryId }, updatedInventory, {
      new: true,
    });

    res.json({ message: "Update item success", result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update draft to active inventory
export const activeInventory = async (req, res) => {
  try {
    const updateDrafInventory = await Inventories.findByIdAndUpdate(
      req.params.id,
      { draft: false },
      { new: true }
    );

    if (!updateDrafInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.json({
      message: `${updateDrafInventory.asset_name} changes to active.`,
      inventory: updateDrafInventory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// draft inventory (soft delete)
export const draftInventory = async (req, res) => {
  try {
    const updateDrafInventory = await Inventories.findByIdAndUpdate(
      req.params.id,
      { draft: true },
      { new: true }
    );

    if (!updateDrafInventory) {
      return res.status(404).json({ message: "Inventory not found." });
    }

    res.json({
      message: `${updateDrafInventory.asset_name} marked as draft.`,
      inventory: updateDrafInventory,
    });
  } catch (error) {
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
