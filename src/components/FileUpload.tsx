
import React, { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDelayedAppearance } from '@/utils/animationUtils';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  isProcessing,
  className 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const isVisible = useDelayedAppearance(300);
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Pass file to parent component
    onFileSelected(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-md px-8 py-12 rounded-xl border-2 border-dashed transition-all duration-300 relative overflow-hidden",
          dragActive ? "border-primary bg-primary/5" : "border-muted",
          previewUrl ? "bg-black/5" : "bg-transparent",
          "hover:border-primary/70"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {isProcessing ? (
                <p className="text-white text-lg font-medium animate-pulse-subtle">
                  Processing...
                </p>
              ) : (
                <p className="text-white text-lg font-medium">
                  Click to change image
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8 text-muted-foreground"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" x2="22" y1="5" y2="5" />
                <line x1="19" x2="19" y1="2" y2="8" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload your handwritten notes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your image here, or click to select a file
            </p>
            <Button variant="outline" type="button" disabled={isProcessing}>
              Select Image
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center max-w-sm">
        <p className="text-sm text-muted-foreground">
          Your image will be processed to extract and organize the data into a spreadsheet format.
          <br />
          We support JPEG, PNG, and other common image formats.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
