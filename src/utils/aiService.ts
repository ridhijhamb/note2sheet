
// Mock API service for handling the OCR and data processing
// In a real application, this would connect to a backend service

export interface ProcessedResult {
  id: string;
  status: 'success' | 'failed';
  downloadUrl?: string;
  sheetLink?: string;
  previewData?: {
    headers: string[];
    rows: string[][];
  };
  error?: string;
}

export const processImage = async (file: File): Promise<ProcessedResult> => {
  return new Promise((resolve) => {
    // Simulate API processing time
    setTimeout(() => {
      // In a real implementation, this would send the file to a backend
      // service using fetch or a similar method.
      
      // For demo purposes, we'll return mock data
      if (Math.random() > 0.1) { // 90% success rate for demo
        resolve({
          id: generateId(),
          status: 'success',
          downloadUrl: '#',
          sheetLink: 'https://docs.google.com/spreadsheets/d/example',
          previewData: {
            headers: ['Date', 'Item', 'Amount', 'Category'],
            rows: [
              ['2023-06-15', 'Grocery shopping', '$78.50', 'Food'],
              ['2023-06-16', 'Gasoline', '$45.00', 'Transportation'],
              ['2023-06-18', 'Movie tickets', '$24.00', 'Entertainment'],
              ['2023-06-20', 'Dinner', '$52.75', 'Food'],
              ['2023-06-21', 'Phone bill', '$85.99', 'Utilities']
            ]
          }
        });
      } else {
        resolve({
          id: generateId(),
          status: 'failed',
          error: 'Unable to process the image. Please try with a clearer image.'
        });
      }
    }, 3000); // Simulate 3 second processing time
  });
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
