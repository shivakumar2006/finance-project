import React from 'react';
import "./App.css";
import HomePage from './pages/Home';
import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/Login';
import SignupPage from './pages/Register';

const App = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
            </Routes>
        </>
    )
}

export default App