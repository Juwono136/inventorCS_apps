import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import cartReducer from '../features/cart/cartSlice';
// import tokenReducer from '../features/token/tokenSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        cart: cartReducer,
        // token: tokenReducer,
    }
})