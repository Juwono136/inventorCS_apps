import axios from 'axios'

const API_URL = '/service/inventory'

// get all inventories
const getAllInventories = async (params) => {
    const response = await axios.get(API_URL + "/all_inventories", { params })

    return response.data
}

// get all inventories based on user program
const getInventoriesByProgram = async (token, params) => {
    const response = await axios.get(API_URL + '/all_inventories_by_program', {
        headers: { Authorization: `Bearer ${token}` },
        params
    })

    return response.data
}

// get inventory by id
const getInventoryById = async (inventoryId) => {
    const response = await axios.get(API_URL + `/inventories/${inventoryId}`)

    return response.data
}

// create inventory
const createInventory = async (data, token) => {
    const response = await axios.post(API_URL + '/add_inventory', data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// update inventory
const updateInventory = async (data, token) => {
    const response = await axios.patch(API_URL + `/update_inventory/${data._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// draft inventory (soft delete)
const draftInventory = async (inventoryId, token) => {
    const response = await axios.patch(API_URL + `/draft_inventory/${inventoryId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const inventoryService = {
    getAllInventories,
    getInventoriesByProgram,
    getInventoryById,
    createInventory,
    updateInventory,
    draftInventory
    // deleteInventory
}

export default inventoryService