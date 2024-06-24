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
import UpdateUsersPage from "./pages/Dashboard/UpdateUsersPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { Toaster } from "react-hot-toast";
import ActivationEmail from "./pages/Auth/ActivationEmail";

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
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="user/activate/:token" element={<ActivationEmail />} />
          </Route>

          <Route path="user/reset/:token" element={<ResetPassword />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventories" element={<InventoriesPage />} />
          <Route path="borrowed-item" element={<BorrowedItemPage />} />
          <Route path="users" element={<UpdateUsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;
