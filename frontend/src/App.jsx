import React from 'react';
import "./App.css";
import HomePage from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/Login';
import SignupPage from './pages/Register';
import Dashboard from './pages/Dashboard';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path="/dashboard/*" element={
                    <PrivateRoute><Dashboard /></PrivateRoute>
                } />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />
        </BrowserRouter>
    )
}

export default App