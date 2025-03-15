
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header 
      className={cn(
        "w-full py-6 px-8 flex items-center justify-between animate-slide-down", 
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6 text-primary-foreground"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2" />
            <path d="M8 17h2" />
            <path d="M14 13h2" />
            <path d="M14 17h2" />
          </svg>
        </div>
        <span className="text-xl font-medium">NotesToSheet</span>
      </div>
      <div className="hidden md:flex">
        <span className="text-sm text-muted-foreground">
          Transform handwritten notes into organized data
        </span>
      </div>
    </header>
  );
};

export default Header;
