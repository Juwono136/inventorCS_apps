import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import loanReducer from "../features/loanTransaction/loanSlice";
import notificationReducer from "../features/notification/notificationSlice";
import meetingReducer from "../features/meeting/meetingSlice";
// import tokenReducer from '../features/token/tokenSlice'

export const store = configureStore(
  {
    reducer: {
      auth: authReducer,
      user: userReducer,
      inventory: inventoryReducer,
      loan: loanReducer,
      notification: notificationReducer,
      meeting: meetingReducer,
      // token: tokenReducer,
    },
  },
  // Symbols or other unserializable data not shown (https://github.com/reduxjs/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu)
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({
      serialize: true,
    })
);
