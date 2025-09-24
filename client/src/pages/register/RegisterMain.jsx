import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeaderDetails from './LeaderDetails.jsx';
import Verification from './Verification_new.jsx';
import Payment from './Payment.jsx';

const RegisterMain = () => {
  return (
    <Routes>
      <Route path="/" element={<LeaderDetails />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};

export default RegisterMain;