import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, IconButton, Typography, Chip } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Task } from '../../constants/types';
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
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`mb-3 ${isDragging ? 'border border-primary' : ''}`}
    >
      <CardHeader
        className="d-flex align-items-center justify-content-between border-bottom"
        action={
          <Chip label="Task" variant="outlined" size="small" />
        }
        avatar={
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            className="text-secondary"
          >
            <DragIndicatorIcon style={{ cursor: 'grab' }}/>
            <span className="visually-hidden">Move task</span>
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body2" className="text-left">
          {task.jobTitle}
        </Typography>
      </CardContent>
    </Card>
  );
}