import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Login from "./components/login";
import Register from "./components/register";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/resetNewPassword";
import ResetNew from "./components/resetPassword";
import Board from "./components/Dnd";
// import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import ApprovalRequest from "./components/ApprovalRequest";
import Dashboard from "./components/main";
const App = () => {
  // const location = useNavigation();
  // const hideNavbarPaths = ['/login', '/register', '/forget-password', '/reset-password', '/reset-new', '/'];
  // const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* {showNavbar && <Navbar />} */}
        <main>
          <Routes>
            <Route >
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard/*" element={<Dashboard/>} />
              <Route path="/reset-new" element={<ResetNew/>} />
              <Route path="/approval-req" element={<ApprovalRequest/>} /> 
              {/* <Route path="/board" element={<Board/>} /> */}
              
              {/* <Route path="/dashboard" element={<Dashboard/>} /> */}



            </Route>
          </Routes>
        </main>
        </div>
    </BrowserRouter>
    
  );
};

export default App;