import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import Positions from "./positions";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Positions', link: '/dashboard/positions' }
    ];
    return (
        <div className="">
             <div className="px-4 py-1"><Breadcrumbs items={breadcrumbItems}/></div>
             {/* <div className="px-4 text fs-4"><strong>Candidates</strong></div> */}
             <div className="" ><Positions/></div>
        </div>
    )
}
export default Board;
