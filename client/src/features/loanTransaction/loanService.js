import axios from 'axios'

const API_URL = '/service/loan'

// get all loan transaction
const getAllLoanTransactions = async (token) => {
    const response = await axios.get(API_URL + '/all_loan', {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// create loan transaction
const createLoanTransaction = async (loanData, token) => {
    const response = await axios.post(API_URL + '/create_loan', loanData, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const loanService = {
    getAllLoanTransactions,
    createLoanTransaction
}

export default loanService