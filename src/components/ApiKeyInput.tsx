
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if API key exists in environment or localStorage
    const hasKey = !!env.OPENAI_API_KEY || !!localStorage.getItem('openai_api_key');
    setIsVisible(!hasKey);
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (in a production app, consider more secure options)
    localStorage.setItem('openai_api_key', apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for this session",
    });
    
    setIsVisible(false);
    onApiKeySet();
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-8 p-6 border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-medium mb-4">OpenAI API Key Required</h3>
      <p className="text-sm text-muted-foreground mb-4">
        To process images, you need to provide an OpenAI API key with GPT-4o access.
        Your key is stored locally and never sent to our servers.
      </p>
      
      <div className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={handleSaveKey} className="w-full">
          Save API Key
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Don't have an API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one from OpenAI</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
