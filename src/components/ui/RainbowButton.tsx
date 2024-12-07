import React from 'react';
import { cn } from '../../lib/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "relative px-6 py-2 rounded-lg font-medium text-white overflow-hidden transition-all duration-300 transform hover:scale-102",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600 before:via-pink-600 before:to-blue-600",
        "before:animate-gradient-x before:bg-[length:200%_100%]",
        "hover:shadow-lg hover:shadow-purple-500/25",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};