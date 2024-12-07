import {  useRef } from 'react';
import { motion } from 'framer-motion';

interface DraggableTextProps {
  text: {
    id: string;
    content: string;
    x: number;
    y: number;
    size: number;
    color: string;
    font: string;
  };
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: () => void;
  isSelected: boolean;
}

export function DraggableText({ text, onDragEnd, onClick, isSelected }: DraggableTextProps) {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="absolute inset-0">
      <motion.div
        drag
        dragMomentum={false}
        initial={{ x: text.x, y: text.y }}
        style={{
          position: 'absolute',
          cursor: 'move',
          fontSize: `${text.size}px`,
          color: text.color,
          fontFamily: text.font,
          border: isSelected ? '1px dashed white' : 'none',
          padding: '4px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onDragEnd={(_, info) => {
          onDragEnd(text.id, info.point.x, info.point.y);
        }}
      >
        {text.content}
      </motion.div>
    </div>
  );
}