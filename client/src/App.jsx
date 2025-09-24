import React from "react";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import Home from "./pages/home.jsx";
import RegisterMain from "../src/pages/register/RegisterMain.jsx";
import Login from "./pages/login/login.jsx";
import LeaderDashboard from "./pages/leaderDashboard/leaderDashboard.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <Router>
                <Routes>


                    {/* Routes with navbar */}
                    <Route path="/*" element={
                        <>
                            <Navbar />
                            <main>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/register/*" element={<RegisterMain />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/leader-dashboard" element={<LeaderDashboard />} />


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
