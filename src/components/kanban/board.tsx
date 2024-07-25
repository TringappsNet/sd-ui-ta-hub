import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import KanbanBoard from "./kanban-board";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Kanban', link: '/dashboard/kanban' }
    ];
    return (
        <div className="">
             <div className="px-4 py-1"><Breadcrumbs items={breadcrumbItems}/></div>
             <div className="px-4 text fs-4"><strong>Kanban</strong></div>
             <div className="" ><KanbanBoard/></div>
        </div>
    )
}
export default Board;
