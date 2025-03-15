
interface Env {
  OPENAI_API_KEY?: string;
}

// In a production app, these would be injected at build time
// For demo purposes, we're using a simple object
export const env: Env = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
};
