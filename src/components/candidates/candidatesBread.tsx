import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import Candidates from "./candidates";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Candidates', link: '/dashboard/candidates' }
    ];
    return (
        <div className="">
             <div className="px-4 py-1"><Breadcrumbs items={breadcrumbItems}/></div>
             {/* <div className="px-4 text fs-4"><strong>Candidates</strong></div> */}
             <div className="" ><Candidates/></div>
        </div>
    )
}
export default Board;
