import React, { useState } from 'react';
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../styles/register.css';
import CustomSnackbar from "./CustomSnackbar";

function Register() {
    const [formData, setFormData] = useState({
        userName: "",
        phoneNo: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate each field
        if (!formData.userName || !formData.phoneNo || !formData.email || !formData.password || !formData.confirmPassword) {
            setSnackbarOpen(true);
            setSnackbarMessage("Please fill all fields !");
            setSnackbarVariant("error");
            return;
        }

        // Check if password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            setSnackbarOpen(true);
            setSnackbarMessage(" password do not match !");
            setSnackbarVariant("error");
            return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSnackbarOpen(true);
            setSnackbarMessage("Please enter a valid email  !");
            setSnackbarVariant("error");
            return;
        }

        try {
            const roleId = 1;
            const payload = {
                ...formData,
                roleId: roleId
            };

            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to register");
            }
            setSnackbarOpen(true);
            setSnackbarMessage("Registration successful !");
            setSnackbarVariant("success");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            setFormData({
                userName: "",
                phoneNo: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

          
        } catch (error) {
            console.error("Registration error:", error);
            setSnackbarOpen(true);
            setSnackbarMessage("Failed to register. Please try again.");
            setSnackbarVariant("error");
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setSnackbarMessage("");
    };

    return (
        <div className="image">
            <div className="left">
                <div className="animation-container">
                    <span className="word">t</span>
                    <span className="word">r</span>
                    <span className="word">i</span>
                    <span className="word">n</span>
                    <span className="word">g</span>
                    <span className="word">a</span>
                    <span className="word">p</span>
                    <span className="word">p</span>
                    <span className="word">s</span>
                </div>
                <div className="background-image"></div>
            </div>
            <div className="right">
                <div role="form" onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                    <form onSubmit={handleSubmit}>
                        <div className="card1">
                            <div>
                                <h1 className="gradient-text-sign">Sign up</h1>
                            </div>
                            <div className="form-container-register">
                                <label htmlFor="userName" className="UserName">User Name</label>
                                <div className="input-container">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-user" 
                                        variant="filled"
                                        type="text"
                                        name="userName"
                                        placeholder="User name" 
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <label htmlFor="phoneNo" className="PhoneNo">Mobile No</label>
                                <div className="input-container">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-mobile" 
                                        variant="filled"
                                        type="number"
                                        name="phoneNo"
                                        onChange={handleInputChange}
                                        placeholder="Phone No" 
                                    />
                                </div>
                                <label htmlFor="email" className="Email">Email Address</label>
                                <div className="input-container">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-email" 
                                        variant="filled"
                                        type="text"
                                        name="email"
                                        placeholder="Email" 
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <label htmlFor="password" className="NewPassword">New Password</label>
                                <div className="input-container">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-password" 
                                        variant="filled"
                                        type="password"
                                        name="password"
                                        onChange={handleInputChange}
                                        placeholder="New Password" 
                                    />
                                </div>
                                <label htmlFor="confirmPassword" className="confirmPassword">Confirm Password</label>
                                <div className="input-container">
                                    <TextField 
                                        className="input" 
                                        id="filled-basic-conpassword" 
                                        variant="filled"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password" 
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="button-register">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <CustomSnackbar
                message={snackbarMessage}
                variant={snackbarVariant}
                onClose={handleCloseSnackbar}
                open={snackbarOpen}
            />
        </div>
    );
}

export default Register;
