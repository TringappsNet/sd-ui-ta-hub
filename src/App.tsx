import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import Register from "./components/register";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/resetNewPassword";
import ResetNew from "./components/resetPassword";
import Board from "./components/Dnd";
// import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import ApprovalRequest from "./components/ApprovalRequest";
import React from "react";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route >
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/board" element={<Navbar />} />
            <Route path="/reset-new" element={<ResetNew/>} />
            <Route path="/approval-req" element={<ApprovalRequest/>} /> 
            {/* <Route path="/board" element={<Board/>} /> */}
            
            {/* <Route path="/dashboard" element={<Dashboard/>} /> */}



          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;