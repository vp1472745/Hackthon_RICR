import React from "react";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import { AuthProvider } from "./configs/authContext";
import Home from "./pages/home.jsx";
import RegisterMain from "./pages/register/RegisterMain.jsx"; // fixed path
import Login from "./pages/login/login.jsx";
import LeaderDashboard from "./pages/leaderDashboard/leaderDashboard.jsx";
import AdminLogin from "./pages/login/adminsLogin.jsx";
import AdminDashboard from "./pages/superAdminDashboard/adminDashboard.jsx"; // keep one import
import AdminRegister from "./pages/superAdminDashboard/Tab/adminRegister.jsx"; // fixed name
import SubAdminDashboard from "./pages/adminDashboard/subAdminDashboard.jsx";

import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AuthProvider>
          <Routes>
            {/* Routes with navbar */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/register/*" element={<RegisterMain />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/leader-dashboard" element={<LeaderDashboard />} />
                      <Route path="/dashboard/login" element={<AdminLogin />} />
                      <Route path="/dashboard/super-admin" element={<AdminDashboard />} />
                      <Route path="/dashboard/admin-register" element={<AdminRegister />} />
                      <Route path="/dashboard/sub-admin" element={<SubAdminDashboard />} />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
