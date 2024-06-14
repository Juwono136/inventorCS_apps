import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Auth/SignUp";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import NotFound from "./common/NotFound";
import NavbarComponent from "./components/Navbar";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import InventoriesPage from "./pages/Dashboard/InventoriesPage";
import BorrowedItemPage from "./pages/Dashboard/BorrowedItemPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<NavbarComponent />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/inventories" element={<InventoriesPage />} />
          <Route path="/borrowed-item" element={<BorrowedItemPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
