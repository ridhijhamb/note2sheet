
// AI service for handling the OCR and data processing
// This connects to an LLM API for text extraction and organization

import { env } from '@/lib/env';

export interface ProcessedResult {
  id: string;
  status: 'success' | 'failed' | 'processing';
  downloadUrl?: string;
  sheetLink?: string;
  previewData?: {
    headers: string[];
    rows: string[][];
  };
  error?: string;
}

// For demo purposes, configure this to use your preferred LLM API
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const processImage = async (file: File): Promise<ProcessedResult> => {
  try {
    // First, create a unique ID for this request
    const requestId = generateId();
    
    // Return initial processing state
    const processingResult: ProcessedResult = {
      id: requestId,
      status: 'processing'
    };
    
    // Convert the image to base64 for API transmission
    const base64Image = await fileToBase64(file);
    
    // Get the API key - in production this should be stored securely
    const apiKey = env.OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      throw new Error('API key is missing. Please add it in the settings.');
    }
    
    // Prepare the API request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using GPT-4o for vision capabilities
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing handwritten notes and organizing them into structured data. 
            Extract all text from the image, identify any tabular data, and organize it logically.
            Format your response as JSON with the following structure:
            {
              "headers": ["Column1", "Column2", ...], 
              "rows": [["row1col1", "row1col2", ...], ["row2col1", "row2col2", ...]]
            }`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract and organize the data in this image into a structured format:' },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ],
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to process the image');
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from the API');
    }
    
    // Parse the JSON response
    const extractedData = parseJsonResponse(content);
    
    // In a real application, you would generate a spreadsheet and get a shareable link
    // For demo purposes, we're using a mock link and the extracted data
    return {
      id: requestId,
      status: 'success',
      downloadUrl: '#',
      sheetLink: `https://docs.google.com/spreadsheets/d/example-${requestId}`,
      previewData: extractedData
    };
    
  } catch (error) {
    console.error('Processing error:', error);
    return {
      id: generateId(),
      status: 'failed',
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Helper function to convert a file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// Helper function to parse JSON from the API response
const parseJsonResponse = (content: string): { headers: string[], rows: string[][] } => {
  try {
    // Extract JSON from the text content (the LLM might wrap it in markdown code blocks)
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
    const jsonString = jsonMatch[1] || content;
    
    // Parse the JSON
    const data = JSON.parse(jsonString);
    
    // Validate the structure
    if (!Array.isArray(data.headers) || !Array.isArray(data.rows)) {
      throw new Error('Invalid data structure');
    }
    
    return {
      headers: data.headers,
      rows: data.rows
    };
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    // Return a fallback structure
    return {
      headers: ['Column'],
      rows: [['No data could be extracted. Please try with a clearer image.']]
    };
  }
};
