import { useDraggable, useDroppable } from "@dnd-kit/core";
import { draggableProps, droppableProps } from "../../types";

export const Draggable = (props: draggableProps) => {
    const { id, children, onClick } = props;
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="alert alert-info mb-2"
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const Droppable = (props: droppableProps) => {
    const { id, title, children } = props;
    const { setNodeRef } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className="card shadow-sm"
        >
            <div className="card-header bg-primary text-white text-center">
                {title}
            </div>
            <div className="card-body w-100">
                {children}
            </div>
        </div>
    );
};