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
import Inventories from "./pages/DashboardPages/Inventories";
import BorrowedItems from "./pages/DashboardPages/BorrowedItems";
import UserList from "./pages/DashboardPages/UserList";
import MyProfile from "./pages/DashboardPages/MyProfile";
import MySettings from "./pages/DashboardPages/MySettings";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersInfor, getUserInfor } from "./features/user/userSlice";
import { accessToken } from "./features/token/tokenSlice";
import UpdateUserRole from "./pages/DashboardPages/updateUserRole";
import ProtectedUserRoutes from "./common/ProtectedUserRoutes";

function App() {
  const [sort, setSort] = useState({
    sort: "personal_info.name",
    order: "asc",
  });
  const [program, setProgram] = useState("");
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
    if (userInfor.personal_info?.role === 1) {
      dispatch(getAllUsersInfor({ page, sort, program, search }));
    }
    // setSearchParams({ page, search, sort: sort.sort, order: sort.order });
  }, [dispatch, userInfor, page, sort, program, search]);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<NavbarComponent />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Singup />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="user/activate/:token" element={<ActivationEmail />} />
          </Route>

          <Route path="user/reset/:token" element={<ResetPassword />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="inventories"
            element={
              <ProtectedUserRoutes allowedRoles={[1, 2]}>
                <Inventories />
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
            }
          />
          <Route path="users/update_user/:id" element={<UpdateUserRole />} />

          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<MySettings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
