import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Auth/SignUp";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import NotFound from "./common/NotFound";
import NavbarComponent from "./components/Navbar";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
