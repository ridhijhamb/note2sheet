
import React, { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ProcessingState from '@/components/ProcessingState';
import ResultView from '@/components/ResultView';
import ApiKeyInput from '@/components/ApiKeyInput';
import { processImage, ProcessedResult } from '@/utils/aiService';
import { cn } from '@/lib/utils';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  
  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setResult(null);
    
    try {
      const processedResult = await processImage(selectedFile);
      setResult(processedResult);
    } catch (error) {
      console.error('Processing error:', error);
      
      // Check if the error is due to missing API key
      if (error instanceof Error && error.message.includes('API key')) {
        setNeedsApiKey(true);
      } else {
        setResult({
          id: 'error',
          status: 'failed',
          error: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setResult(null);
  };
  
  const handleApiKeySet = () => {
    setNeedsApiKey(false);
    // If there was a file waiting to be processed, retry
    if (file) {
      handleFileSelected(file);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Notes to Spreadsheet</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your handwritten notes into organized spreadsheets with AI
            </p>
          </div>
          
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
          
          <div className={cn(
            "flex flex-col items-center justify-center transition-all duration-500 relative min-h-[400px]",
          )}>
            <div className={cn(
              "absolute transition-all duration-500",
              !file && !isProcessing && !result ? "opacity-100 z-10" : "opacity-0 z-0"
            )}>
              <FileUpload 
                onFileSelected={handleFileSelected}
                isProcessing={isProcessing}
              />
            </div>
            
            <div className={cn(
              "absolute transition-all duration-500",
              file && isProcessing ? "opacity-100 z-10" : "opacity-0 z-0"
            )}>
              <ProcessingState />
            </div>
            
            <div className={cn(
              "absolute transition-all duration-500",
              result && !isProcessing ? "opacity-100 z-10" : "opacity-0 z-0"
            )}>
              {result && (
                <ResultView 
                  result={result}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-8 border-t bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Transform handwritten notes into organized spreadsheets
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
