import React, { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Board1 from "./Dnd";
import List from './List';
import Board from './kanban/board';
import Candidates from "./candidates/candidates";
import Positions from "./positions/positions";
import Clients from "./clients/clients";
import Users from "./users/users";

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
            <div className="p-4">
                
                <Routes>
                    <Route path="/" element={<Board />} />
                    <Route path="/board" element={<Board1 />}/>
                    <Route path="/candidates" element={<Candidates/>}/>
                    <Route path="/positions" element={<Positions/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/clients" element={<Clients/>}/>
                </Routes>
            </div>
        </div>
    )
}