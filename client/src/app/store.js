import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import loanReducer from '../features/loanTransaction/loanSlice'
// import tokenReducer from '../features/token/tokenSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        inventory: inventoryReducer,
        loan: loanReducer,
        // token: tokenReducer,
    }
})