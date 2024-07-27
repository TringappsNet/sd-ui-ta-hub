import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import Users from "./users";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Users', link: '/dashboard/users' }
    ];
    return (
        <div className="">
             <div className="px-4 py-1"><Breadcrumbs items={breadcrumbItems}/></div>
             {/* <div className="px-4 text fs-4"><strong>Candidates</strong></div> */}
             <div className="" ><Users/></div>
        </div>
    )
}
export default Board;
