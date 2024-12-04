import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List } from "lucide-react";

interface SortableProps {
  children: React.ReactNode;
  id: string;
}

export function SortableItem(props: SortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Separate the handle's attributes and listeners
  const dragHandleAttributes = {
    ...attributes,
    ...listeners,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      {/* Drag Handle */}
      <span
        {...dragHandleAttributes}
        className="cursor-grab mr-2 p-2 bg-transparent rounded opacity-5 hover:opacity-65"
      >
        <List />
      </span>

      {/* Children (input or other component) */}
      <div className="flex-1">{props.children}</div>
    </div>
  );
}
