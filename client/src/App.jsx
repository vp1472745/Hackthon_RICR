import React from "react";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import Home from "./pages/home.jsx";
import RegisterMain from "../src/pages/register/RegisterMain.jsx";
import Login from "./pages/login/login.jsx";
import UserDashboard from "./pages/userdashboard/userDashboard.jsx";
import AdminDashboard from "./pages/admindashboard/adminMain.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    {/* Routes without navbar */}

                    {/* Routes with navbar */}
                    <Route path="/*" element={
                        <>
                            <Navbar />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/register/*" element={<RegisterMain />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/dashboard" element={<UserDashboard />} />
                                    <Route path="/admin" element={<AdminDashboard />} />
                                </Routes>
                            </main>
                        </>
                    } />
                </Routes>
            </Router>
        </>
    );
}

export default App;
