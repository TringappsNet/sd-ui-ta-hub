import React, { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, IconButton, Typography, Chip, Button, Menu, MenuItem } from '@mui/material';
import { Task } from '../../../constants/types';
import { useTaskStore } from '../../../lib/store';
import './index.css';
import TaskDialog from './task-dialog';
// Assuming Task interface is defined as before
interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = 'Task';
export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuJustClosed, setMenuJustClosed] = useState(false);
  const {updateTask} = useTaskStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [status, setStatus] = useState({ label: 'Low', value: 0, color: '#00ff0a' });
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent card click event from firing
    setAnchorEl(event.currentTarget);
    
  };
  const options = [
    { label: 'Low', value: 0, color: '#00ff0a' },
    { label: 'Medium', value: 1, color: 'blue' },
    { label: 'High', value: 2, color: '#FFA500' },
    { label: 'Urgent', value: 3, color: 'red' },

  ]

  const handleClose = (value:number, event) => {
    event.stopPropagation(); // Prevent card click event from firing
    setMenuJustClosed(true);
    setAnchorEl(null);
    setTimeout(() => setMenuJustClosed(false), 100);
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      task.taskStatus = selectedOption.label;
      updateTask(task.taskId, task );
      setStatus(selectedOption);
    }
    
  };
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.taskId,
    data: {
      type: 'Task',
      task
    } as TaskDragData,
    attributes: {
      roleDescription: 'Task'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    border: isOverlay ? '2px solid primary' : 'none'
  };
  
  return (
    <>
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`mb-3 ${isDragging ? 'border border-primary card' : 'card'}`}
    >
      <CardHeader
        className="d-flex w-full "
        {...attributes}
        {...listeners}
        action={
          <></>
          // <Chip label="Task" variant="outlined" size="small" />
        }
        avatar={
          <div className='w-full d-flex'>
          
          <div className='me-auto'>
            <span className="text-dark px-0 py-0 ralewayFont d-flex align-items-center justify-content-between text-wrap"
              // style={{
              //   "fontFamily": "Raleway, sans-serif",
              //   "fontSize": "16px",
              //   "fontStyle": 'normal',
              // }}
            ># {task.jobTitle}</span>
          
          </div>
          
          </div>
          
        }
        
        sx={{
          '& .MuiCardHeader-content': {
            width: 0,
          },
          '& .MuiCardHeader-avatar': {
            width: '100%',
            display: 'block',
            paddingBottom: 0,
            borderBottom: '1px solid #eeeeee',
          },
          cursor: `${isDragging ? 'grabbing' : 'grab'} !important`,
          fontFamily: '',
          padding : '10px 10px 0px 10px',
        }}
      />
      <CardContent
        onClick={() => {
          if (!open && !menuJustClosed) {
            setDialogOpen(true);
          }
        }}
        sx={{
          padding: '30px 10px 10px 10px',
          '&:last-child': {
            paddingBottom: '10px',
          }
        }}
        
      >
        <Typography variant="body2" className="text-left">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className='border shadow-sm '
        >
          <span className="d-inline-block border border-1 " style={{
            "width": "10px", 
            "height": "10px",
            "backgroundColor": status.color,
            "padding" : "7px",
            "borderRadius": "10%",
            }}></span>
          <span className='text-dark px-2 ralewayFontRegular'>{status.label}</span>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={(e)=> handleClose(status.value,e)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem  onClick={(e) => handleClose(0,e)}>Low</MenuItem>
          <MenuItem onClick={(e) => handleClose(1,e)}>Medium</MenuItem>
          <MenuItem onClick={(e) => handleClose(2,e)}>High</MenuItem>
          <MenuItem onClick={(e) => handleClose(3,e)}>Urgent</MenuItem>
        </Menu>
          
        </Typography>
        
      </CardContent>
      <div className="hover-effect"
        style={{
          backgroundColor: status.color,
        }}
      ></div>
      
    </Card>
    <TaskDialog open={dialogOpen} setOpen={setDialogOpen} task={task} />
    </>
  );
}