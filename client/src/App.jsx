import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// pages
import Home from "./pages/HomePages/HomeLayout";
import SigninPage from "./pages/AuthPages/SigninPage";
import SingupPage from "./pages/AuthPages/SingupPage";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import ActivationEmailPage from "./pages/AuthPages/ActivationEmailPage";
import DashboardPage from "./pages/DashboardPages/DashboardPage";
import InventoriesPage from "./pages/DashboardPages/InventoriesPage";
import BorrowedItemsPage from "./pages/DashboardPages/BorrowedItemsPage";
import UserListPage from "./pages/DashboardPages/UserListPage";
import MyProfilePage from "./pages/DashboardPages/MyProfilePage";
import MySettingsPage from "./pages/DashboardPages/MySettingsPage";
import UpdateUserRolePage from "./pages/DashboardPages/UpdateUserRolePage";
import SelecteRolePage from "./pages/AuthPages/SelecteRolePage";
import AddInventoryPage from "./pages/DashboardPages/AddInventoryPage";
import UpdateInventoryPage from "./pages/DashboardPages/UpdateInventoryPage";
import MyCartPage from "./pages/HomePages/MyCartPage";
import LoanTransactionByUserPage from "./pages/DashboardPages/LoanTransactionByUserPage";
import UserLoanTransactionPage from "./pages/DashboardPages/UserLoanTransactionPage";
import LoanTransactionDetailPage from "./pages/DashboardPages/LoanTransactionDetailPage";
import UserNotificationsPage from "./pages/DashboardPages/UserNotificationsPage";

// components
import NavbarComponent from "./components/HomeComponents/NavbarComponent";
import NotFound from "./common/NotFound";
import ProtectedUserRoutes from "./common/ProtectedUserRoutes";
import InventoryDetailComponent from "./components/HomeComponents/InventoryDetailComponent";

// features
import { getUserInfor } from "./features/user/userSlice";
import { getAllInventories } from "./features/inventory/inventorySlice";

function App() {
  const [sortUser, setSortUser] = useState({
    sort: "personal_info.name",
    order: "asc",
  });
  const [sortInventory, setSortInventory] = useState({
    sort: "asset_name",
    order: "asc",
  });
  const [program, setProgram] = useState("");
  const [categories, setCategories] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user, isLoggedOut } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedOut && user) {
      dispatch(getUserInfor());
    }
  }, [isLoggedOut, dispatch, user]);

  useEffect(() => {
    dispatch(
      getAllInventories({ page, sort: sortInventory, categories, search })
    );
  }, [page, sortInventory, categories, search]);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Not found routes */}
          <Route path="*" element={<NotFound />} />

          {/* Home page routes */}
          <Route path="/" element={<NavbarComponent />}>
            <Route
              index
              element={
                <Home
                  sort={sortInventory}
                  setSort={setSortInventory}
                  categories={categories}
                  setCategories={setCategories}
                  page={page}
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                />
              }
            />
            <Route path="mycarts" element={<MyCartPage />} />

            {/* Auth page routes */}
            <Route path="signin" element={<SigninPage />} />
            <Route path="signup" element={<SingupPage />} />
            <Route path="forgot" element={<ForgotPasswordPage />} />
            <Route
              path="user/activate/:token"
              element={<ActivationEmailPage />}
            />

            {/* inventory routes */}
            <Route
              path="item_detail/:id"
              element={<InventoryDetailComponent />}
            />
          </Route>

          {/* Auth page routes */}
          <Route path="select-role" element={<SelecteRolePage />} />
          <Route path="user/reset/:token" element={<ResetPasswordPage />} />

          {/* Dashboard routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="settings" element={<MySettingsPage />} />

          {/* inventory routes */}
          <Route
            path="inventories"
            element={
              <ProtectedUserRoutes allowedRoles={[2]}>
                <InventoriesPage
                  sort={sortInventory}
                  setSort={setSortInventory}
                  categories={categories}
                  setCategories={setCategories}
                  page={page}
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="add_inventory"
            element={
              <ProtectedUserRoutes allowedRoles={[2]}>
                <AddInventoryPage />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="inventories/update_inventory/:id"
            element={
              <ProtectedUserRoutes allowedRoles={[2]}>
                <UpdateInventoryPage />
              </ProtectedUserRoutes>
            }
          />

          {/* Loan transaction routes */}
          <Route
            path="borrowed-item"
            element={
              <ProtectedUserRoutes allowedRoles={[2]}>
                <BorrowedItemsPage />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="user-loan"
            element={
              <ProtectedUserRoutes allowedRoles={[0, 1, 2]}>
                <UserLoanTransactionPage />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="user-loan/detail/:id"
            element={
              <ProtectedUserRoutes allowedRoles={[0, 1, 2]}>
                <LoanTransactionByUserPage />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="/user-loan/detail-loan/:id"
            element={
              <ProtectedUserRoutes allowedRoles={[2]}>
                <LoanTransactionDetailPage />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedUserRoutes allowedRoles={[0, 1, 2]}>
                <UserNotificationsPage />
              </ProtectedUserRoutes>
            }
          />

          {/* User routes */}
          <Route
            path="users"
            element={
              <ProtectedUserRoutes allowedRoles={[1]}>
                <UserListPage
                  sort={sortUser}
                  setSort={setSortUser}
                  program={program}
                  setProgram={setProgram}
                  page={page}
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                />
              </ProtectedUserRoutes>
            }
          />
          <Route
            path="users/update_user/:id"
            element={
              <ProtectedUserRoutes allowedRoles={[1]}>
                <UpdateUserRolePage />
              </ProtectedUserRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
