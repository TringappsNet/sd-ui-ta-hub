import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, Button, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../lib/store';
import { ColumnActions } from './column-action';
import TaskCard from './task-card';
import { GripVertical } from 'lucide-react';
export interface Column {
  id: string;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } as ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const cardClassName = `h-75vh  bg-light flex-column flex-shrink-0 snap-center me-3 ms-1 ${
    isOverlay ? 'border border-primary' : isDragging ? 'opacity-30' : ''
  }`;

  return (
    <Card ref={setNodeRef} style={style} className={cardClassName} sx={{
      height: '70vh',
      weight: '20vw !important' ,

    }}>
      <CardHeader 
        className="d-flex flex-row align-items-center border-bottom p-3"
        title={
          <Box className="d-flex align-items-center ">
            {/* <Button
              
            >
              <span className="visually-hidden">{`Move column: ${column.title}`}</span>
              <DragIndicatorIcon />
            </Button> */}
            <GripVertical 
              {...attributes}
              {...listeners}
              className="me-2 p-1 text-muted border-0"
              style={{ cursor: 'grab' }}
              size={32}
              aria-hidden="true"

            />

            <ColumnActions id={column.id} title={column.title} />
          </Box>
        }
      />
      <CardContent className="d-flex flex-column flex-grow-1 gap-3  p-2">
        <Box className=" h-100">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} id={task.id} title={task.title} description={undefined} columnId={"1"} />
            ))}
          </SortableContext>
        </Box>
      </CardContent>
    </Card>
  );
}


export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const containerClasses = `
    px-2 pb-4 d-flex justify-content-lg-start 
    ${dndContext.active ? '' : 'snap-x snap-mandatory'}
  `;

  return (
    <div className="container-fluid">
      <div className={containerClasses} style={{  whiteSpace: 'nowrap' }}>
        <div className="d-flex flex-row align-items-start justify-content-center gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Column;