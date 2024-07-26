import { FC } from "react";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./task-card";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { columnType} from '../../lib/store';


const Column: FC<columnType> = ({ id, title, tasks }) => {
  const { setNodeRef: setDroppableNodeRef } = useDroppable({ id: id });
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: "70vh",
    borderRadius: 5,
    width: 300,
  };

  return (
    <div
      ref={(node) => {
        setDroppableNodeRef(node);
        setSortableNodeRef(node);
      }}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-light me-3 rounded-sm "
    >
      <SortableContext id={id} items={tasks} strategy={rectSortingStrategy}>
        <div className="text text-dark sticky-top border-bottom p-2">
            <div className="p-2 border rounded w-100 shadow-sm" >{title}</div></div>
        <div className="overflow-y-auto px-2" style={{height: "60vh",}}>
            {tasks.map((card) => (
                <Card key={card.id} id={card.id} title={card.title} description={card.description} columnId={card.columnId} />
            ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;