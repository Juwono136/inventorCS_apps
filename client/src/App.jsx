import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/HomeComponents/NavbarComponent";
import Home from "./pages/HomePages/HomeLayout";
import Signin from "./pages/AuthPages/Signin";
import Singup from "./pages/AuthPages/Singup";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ActivationEmail from "./pages/AuthPages/ActivationEmail";
import NotFound from "./common/NotFound";
import Dashboard from "./pages/DashboardPages/Dashboard";
import { Toaster } from "react-hot-toast";
import Inventory from "./pages/InventoryPages/Inventory";
import Inventories from "./pages/DashboardPages/Inventories";
import BorrowedItems from "./pages/DashboardPages/BorrowedItems";
import UserList from "./pages/DashboardPages/UserList";
import MyProfile from "./pages/DashboardPages/MyProfile";
import MySettings from "./pages/DashboardPages/MySettings";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersInfor, getUserInfor } from "./features/user/userSlice";
import { accessToken } from "./features/token/tokenSlice";
import UpdateUserRole from "./pages/DashboardPages/updateUserRole";
import MyCarts from "./pages/HomePages/MyCarts";
import { CartProvider } from "./components/InventoryComponents/CartContext";
import ProtectedUserRoutes from "./common/ProtectedUserRoutes";
import { getAllInventories } from "./features/inventory/inventorySlice";
import MyBorrow from "./pages/HomePages/MyBorrow";
import SelecteRole from "./pages/AuthPages/SelecteRole";
import AddInventory from "./pages/DashboardPages/AddInventory";
import UpdateInventory from "./pages/DashboardPages/UpdateInventory";

function App() {
  const [sort, setSort] = useState({
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
  const { userInfor } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedOut && user) {
      dispatch(getUserInfor()).then((res) => {
        dispatch(accessToken(res));
      });
    }
  }, [isLoggedOut, dispatch, user]);

  useEffect(() => {
    if (user?.selectedRole === 1) {
      dispatch(getAllUsersInfor({ page, sort, program, search }));
    }

    dispatch(getAllInventories({ page, sort, categories, search }));
    // setSearchParams({ page, search, sort: sort.sort, order: sort.order });
  }, [dispatch, userInfor, page, sort, program, categories, search]);

  return (
    <>
      <Toaster />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<NavbarComponent />}>
              <Route index element={<Home />} />
              <Route path="signin" element={<Signin />} />
              <Route path="signup" element={<Singup />} />
              <Route path="forgot" element={<ForgotPassword />} />
              <Route path="user/activate/:token" element={<ActivationEmail />} />
              <Route path="mycarts" element={<MyCarts />} />
            </Route>

            <Route path="select-role" element={<SelecteRole />} />

            <Route path="user/reset/:token" element={<ResetPassword />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route 
              path="inventory" 
              element={
                <Inventory 
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

          <Route
            path="add_inventory"
            element={
              <ProtectedUserRoutes allowedRoles={[1, 2]}>
                <AddInventory />
              </ProtectedUserRoutes>
            }
          />

          <Route
            path="inventories/update_inventory/:id"
            element={
              <ProtectedUserRoutes allowedRoles={[1, 2]}>
                <UpdateInventory />
              </ProtectedUserRoutes>
            }
          />

          <Route
            path="borrowed-item"
            element={
              <ProtectedUserRoutes allowedRoles={[1, 2]}>
                <BorrowedItems />
              </ProtectedUserRoutes>
            }
          />

            <Route
              path="inventories"
              element={
                <ProtectedUserRoutes allowedRoles={[1, 2]}>
                  <Inventories
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
              path="borrowed-item"
              element={
                <ProtectedUserRoutes allowedRoles={[1, 2]}>
                  <BorrowedItems />
                </ProtectedUserRoutes>
              }
            />

            <Route
              path="users"
              element={
                <ProtectedUserRoutes allowedRoles={[1]}>
                  <UserList
                    sort={sort}
                    setSort={setSort}
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
                  <UpdateUserRole />
                </ProtectedUserRoutes>
              }
            />

            <Route path="myborrow" element={<MyBorrow />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="settings" element={<MySettings />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
