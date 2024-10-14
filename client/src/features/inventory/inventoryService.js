import axios from 'axios'

const API_URL = '/service/inventory'

// get all inventories
const getAllInventories = async (params) => {
    const response = await axios.get(API_URL + "/all_inventories", { params })

    return response.data
}

// update inventory
const updateInventory = async (data, token) => {
    const response = await axios.patch(API_URL + `/update_inventory/${data._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// draft inventory
const draftInventory = async (data, token) => {
    const response = await axios.patch(API_URL + `/draft_inventory/${data._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const inventoryService = {
    getAllInventories,
    updateInventory,
    draftInventory
}

export default inventoryService