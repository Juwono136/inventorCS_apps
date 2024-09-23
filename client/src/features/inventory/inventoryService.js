import axios from 'axios'

const API_URL = '/service/inventory'

// get all inventories
const getAllInventories = async (params) => {
    const response = await axios.get(API_URL + "/all_inventories", { params })

    return response.data
}

const inventoryService = {
    getAllInventories
}

export default inventoryService