import React, { useState } from "react";
import {FastForward} from "lucide-react";
import { Link } from "react-router-dom";
import '../../styles/Navbar.css';

export default function Navbar(){
    const navItems = [
        { name: 'Candidates', href: '/dashboard/candidates' },
        { name: 'Positions', href: '/dashboard/positions' },
        { name: 'Users', href: '/dashboard/users' },
        { name: 'Clients', href: '/dashboard/clients' }
    ];
    const [activeLink, setActiveLink] = useState('');
    const handleClick = (linkName) => {
        setActiveLink(linkName);
    };
    
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-5 py-1 border-bottom flex flex-row align-items-center">
                <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" 
                data-target="#navbarExample" aria-controls="navbarExample" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand pt-0" href="/dashboard"><FastForward color="#357DE8"/><span className=" text font-weight-bold text-dark">tringapps</span></a>
                <div className="collapse navbar-collapse" id="navbarExample">
                <ul className="navbar-nav  px-3">
                    {navItems.map((item, index)=>(
                        <li className={`nav-item  px-1 ${activeLink === item.name ? 'pb-0' : 'pb-1'}`} key={item.name}>
                        <Link
                          to={item.href}
                          className={`nav-link text font-weight-bold ${activeLink === item.name ? 'active' : ''}`}
                          onClick={() => handleClick(item.name)}
                          style={{
                            borderBottom: activeLink === item.name ? '2px solid #007bff' : 'none',
                            color: activeLink === item.name ? '#007bff' : '',
                          }}
                        >
                          <span className="h-100 p-2 pb-1 menuItem">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
                <div className="px-3 ">
                    <button className="btn text text-light font-weight-bold px-2 py-1 pb-0 mb-1" >Create</button>
                </div>
                
                <div className="ms-auto mb-0">
                    <button className="btn btn-primary rounded-circle text font-weight-bold pt-2 " ><span className="">D</span></button>

                </div>
                </div>
            </div>
        </nav>
    )
}