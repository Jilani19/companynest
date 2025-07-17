// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CompanyForm from "./components/CompanyForm";
import AdminLogin from "./components/AdminLogin";
import AdminCompanyList from "./components/AdminCompanyList";
import EditCompanyForm from "./components/EditCompanyForm";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CompanyForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
         <Route
  path="/admin/companylist"
  element={
    <ProtectedRoute>
      <AdminCompanyList />
    </ProtectedRoute>
  }
/>

          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <EditCompanyForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
