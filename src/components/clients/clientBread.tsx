import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import Clients from "./clients";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Clients', link: '/dashboard/clients' }
    ];
    return (
        <div className="">
             <div className="px-4 py-1"><Breadcrumbs items={breadcrumbItems}/></div>
             {/* <div className="px-4 text fs-4"><strong>Candidates</strong></div> */}
             <div className="" ><Clients/></div>
        </div>
    )
}
export default Board;
