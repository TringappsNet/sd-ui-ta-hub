import React from "react";
import {Breadcrumbs} from "../breadcrumbs";
import {KanbanBoard} from "./kanban-board";
import NewTaskDialog from "./new-task-dialog";


const Board = ()=>{
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Kanban', link: '/dashboard/kanban' }
    ];
    return (
        <div className="">
             <div className="px-4 "><Breadcrumbs items={breadcrumbItems}/></div>
             <div className="d-flex flex-row ">
                <div className="px-4 text fs-4 me-auto">
                    <strong >Kanban</strong>
                </div> 
                {/* <div><NewTaskDialog /></div> */}
            </div>
             {/* <div className="px-4 me-auto"></div> */}
             <div className="" ><KanbanBoard/></div>
        </div>
    )
}
export default Board;
