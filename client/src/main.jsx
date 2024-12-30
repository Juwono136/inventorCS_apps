import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// files
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";

// icons and material-tailwind
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);
