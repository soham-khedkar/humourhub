import React from 'react';
import { motion } from 'framer-motion';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex p-1 gap-1 bg-black/40 backdrop-blur-lg rounded-lg border border-purple-500/20">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className="relative flex-1 px-4 py-2 text-sm font-medium"
        >
          {value === option.value && (
            <motion.div
              layoutId="toggle-active"
              className="absolute inset-0 bg-purple-500/20 rounded-md"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 ${
            value === option.value ? 'text-white' : 'text-gray-400'
          }`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};