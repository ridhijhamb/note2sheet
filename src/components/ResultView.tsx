
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProcessedResult } from '@/utils/aiService';
import { useToast } from '@/components/ui/use-toast';
import { useDelayedAppearance, useSequentialAppearance } from '@/utils/animationUtils';

interface ResultViewProps {
  result: ProcessedResult;
  onReset: () => void;
  className?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onReset, className }) => {
  const { toast } = useToast();
  const isVisible = useDelayedAppearance(300);
  const visibleRows = useSequentialAppearance(
    result.previewData ? result.previewData.rows.length + 1 : 0, 
    200
  );
  
  const handleCopyLink = () => {
    if (result.sheetLink) {
      navigator.clipboard.writeText(result.sheetLink)
        .then(() => {
          toast({
            title: "Link copied",
            description: "Spreadsheet link copied to clipboard",
          });
        })
        .catch(() => {
          toast({
            title: "Failed to copy",
            description: "Please try again or copy manually",
            variant: "destructive",
          });
        });
    }
  };

  if (result.status === 'failed') {
    return (
      <div className={cn(
        "w-full max-w-md transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}>
        <div className="rounded-xl glass-card p-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 text-destructive"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Processing Failed</h3>
          <p className="text-muted-foreground mb-6">
            {result.error || "We couldn't process your image. Please try again with a clearer image."}
          </p>
          <Button onClick={onReset}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-3xl transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      className
    )}>
      <div className="rounded-xl glass-card p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 text-primary"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Processing Complete</h3>
            <p className="text-muted-foreground">
              Your notes have been successfully organized
            </p>
          </div>
        </div>
        
        {result.previewData && (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className={cn(
                  "transition-all duration-300 bg-secondary",
                  visibleRows[0] ? "opacity-100" : "opacity-0"
                )}>
                  {result.previewData.headers.map((header, i) => (
                    <th 
                      key={i} 
                      className="px-4 py-2 text-left text-sm font-medium border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.previewData.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={cn(
                      "transition-all duration-300",
                      visibleRows[rowIndex + 1] ? "opacity-100" : "opacity-0",
                      rowIndex % 2 === 0 ? "bg-white/50 dark:bg-white/5" : "bg-transparent"
                    )}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        className="px-4 py-2 text-sm border-b border-muted"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex-1 w-full">
            <div className="p-3 bg-muted/50 rounded-lg flex items-center">
              <input 
                type="text" 
                readOnly 
                value={result.sheetLink || ''} 
                className="flex-1 bg-transparent border-0 focus:ring-0 text-sm"
              />
              <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4 mr-2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReset}>
              New Upload
            </Button>
            <Button 
              as="a" 
              href={result.sheetLink} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Open Sheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
