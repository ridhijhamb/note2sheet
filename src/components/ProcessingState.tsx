
import React from 'react';
import { cn } from '@/lib/utils';
import { useSmoothProgress, useDelayedAppearance } from '@/utils/animationUtils';

interface ProcessingStateProps {
  className?: string;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ className }) => {
  // Simulate progress updates
  const [progressStage, setProgressStage] = React.useState(0);
  const isVisible = useDelayedAppearance(300);
  
  React.useEffect(() => {
    const stages = [15, 35, 60, 85, 95];
    const timers: NodeJS.Timeout[] = [];
    
    stages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setProgressStage(index + 1);
      }, 500 + index * 500);
      timers.push(timer);
    });
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  const progressMapping = [15, 35, 60, 85, 95];
  const currentProgress = progressMapping[progressStage] || 0;
  const progress = useSmoothProgress(currentProgress);
  
  const steps = [
    "Analyzing image...",
    "Recognizing text...",
    "Extracting data...",
    "Organizing content...",
    "Preparing spreadsheet..."
  ];

  return (
    <div className={cn(
      "w-full max-w-md transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      className
    )}>
      <div className="rounded-xl glass-card p-8">
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg 
              className="w-full h-full text-muted absolute animate-spin-slow"
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="1, 6"
              />
            </svg>
            <div className="text-lg font-semibold">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center transition-all duration-300",
                index <= progressStage ? "opacity-100" : "opacity-30"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full mr-3 flex items-center justify-center transition-colors",
                index < progressStage ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {index < progressStage ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-3 h-3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-sm",
                index === progressStage ? "font-medium text-foreground" : "text-muted-foreground",
                index < progressStage && "line-through opacity-70"
              )}>
                {step}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground animate-pulse-subtle">
            Please wait while we process your image...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;
