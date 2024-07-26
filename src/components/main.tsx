import React, { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Board1 from "./Dnd";
import List from './List';
import Board from './kanban/board';


export default function Dashboard(){
    const navigate = useNavigate();
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            console.log(isLoggedIn);
            navigate("/login");
        }
    }, [navigate]);
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="p-4 ">
                
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/board" element={<Board1 />}/>
                    <Route path="/candidates" element={<></>}/>
                    <Route path="/positions" element={<></>}/>
                    <Route path="/users" element={<></>}/>
                    <Route path="/clients" element={<></>}/>
                </Routes>
            </div>
        </div>
    )
}