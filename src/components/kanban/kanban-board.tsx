import React, { useState } from "react";
import Task from "./task-card";
import {useKanbanStore, columnType} from '../../lib/store';
import { 
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
 } from "@dnd-kit/core";
 import { arrayMove,rectSortingStrategy,SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
 import Column from "./board-column";

const KanbanBoard = () => {
  const data = useKanbanStore(state => state.columns);
  // const data: ColumnType[] = [
  //   {
  //     id: "Column1",
  //     title: "Column1",
  //     cards: [
  //       {
  //         id: "Card1",
  //         title: "Card1"
  //       },
  //       {
  //         id: "Card2",
  //         title: "Card2"
  //       }
  //     ]
  //   },
  //   {
  //     id: "Column2",
  //     title: "Column2",
  //     cards: [
  //       {
  //         id: "Card3",
  //         title: "Card3"
  //       },
  //       {
  //         id: "Card4",
  //         title: "Card4"
  //       },
  //       {
  //         id: "Card5",
  //         title: "Card3"
  //       },
  //       {
  //         id: "Card6",
  //         title: "Card4"
  //       },
  //       {
  //         id: "Card7",
  //         title: "Card3"
  //       },
  //       {
  //         id: "Card8",
  //         title: "Card4"
  //       },
  //       {
  //         id: "Card9",
  //         title: "Card3"
  //       },
  //       {
  //         id: "Card0",
  //         title: "Card4"
  //       },
  //     ]
  //   }
  // ];
  const [columns, setColumns] = useState<columnType[]>(data);

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.tasks.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };
  const isColumn = (id: string) => columns.some(col => col.id === id);

  const findColumnByCardId = (cardId: string) => {
    return columns.find(column => column.tasks.some(card => card.id === cardId));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (isColumn(activeId) && isColumn(overId) && activeId !== overId) {
      setColumns((prevColumns) => {
        const oldIndex = prevColumns.findIndex((col) => col.id === activeId);
        const newIndex = prevColumns.findIndex((col) => col.id === overId);
        return arrayMove(prevColumns, oldIndex, newIndex);
      });
    } else if (!isColumn(activeId) && !isColumn(overId)) {
      const activeColumn = findColumnByCardId(activeId);
      const overColumn = findColumnByCardId(overId);

      if (!activeColumn || !overColumn || activeColumn === overColumn) {
        return;
      }

      setColumns((prevColumns) => {
        const activeColumnIndex = prevColumns.findIndex((col) => col.id === activeColumn.id);
        const overColumnIndex = prevColumns.findIndex((col) => col.id === overColumn.id);

        const activeItems = [...prevColumns[activeColumnIndex].tasks];
        const overItems = [...prevColumns[overColumnIndex].tasks];

        const activeIndex = activeItems.findIndex((item) => item.id === activeId);
        const overIndex = overItems.findIndex((item) => item.id === overId);

        let newIndex: number;
        if (overItems.some(item => item.id === overId)) {
          newIndex = overIndex;
        } else {
          newIndex = overItems.length;
        }

        const updatedColumns = [...prevColumns];
        const [removedItem] = updatedColumns[activeColumnIndex].tasks.splice(activeIndex, 1);
        updatedColumns[overColumnIndex].tasks.splice(newIndex, 0, removedItem);

        return updatedColumns;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (isColumn(activeId) && isColumn(overId) && activeId !== overId) {
      setColumns((columns) => {
        const oldIndex = columns.findIndex((col) => col.id === activeId);
        const newIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, oldIndex, newIndex);
      });
    } else if (!isColumn(activeId) && !isColumn(overId)) {
      const activeColumn = findColumnByCardId(activeId);
      const overColumn = findColumnByCardId(overId);

      if (!activeColumn || !overColumn) {
        return;
      }

      if (activeColumn !== overColumn) {
        setColumns((prevColumns) => {
          const activeColumnIndex = prevColumns.findIndex((col) => col.id === activeColumn.id);
          const overColumnIndex = prevColumns.findIndex((col) => col.id === overColumn.id);

          const activeItems = [...prevColumns[activeColumnIndex].tasks];
          const overItems = [...prevColumns[overColumnIndex].tasks];

          const activeIndex = activeItems.findIndex((item) => item.id === activeId);
          const overIndex = overItems.findIndex((item) => item.id === overId);

          let newIndex: number;
          if (overItems.some(item => item.id === overId)) {
            newIndex = overIndex;
          } else {
            newIndex = overItems.length;
          }

          const updatedColumns = [...prevColumns];
          const [removedItem] = updatedColumns[activeColumnIndex].tasks.splice(activeIndex, 1);
          updatedColumns[overColumnIndex].tasks.splice(newIndex, 0, removedItem);

          return updatedColumns;
        });
      } else {
        // Same column
        setColumns((prevColumns) => {
          const columnIndex = prevColumns.findIndex((col) => col.id === activeColumn.id);
          const items = [...prevColumns[columnIndex].tasks];
          const activeIndex = items.findIndex((item) => item.id === activeId);
          const overIndex = items.findIndex((item) => item.id === overId);
          
          if (activeIndex !== overIndex) {
            const updatedColumns = [...prevColumns];
            updatedColumns[columnIndex].tasks = arrayMove(items, activeIndex, overIndex);
            return updatedColumns;
          }
          return prevColumns;
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
    return (
      <>
        <div className="" >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext items={columns.map(col => col.id)} strategy={rectSortingStrategy}>

          <div
            className="d-flex flex-row p-4 overflow-x-auto "
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
              ></Column>
            ))}
          </div>
          </SortableContext>

        </DndContext>
        </div>
      </>
    );
  };
  
  export default KanbanBoard;