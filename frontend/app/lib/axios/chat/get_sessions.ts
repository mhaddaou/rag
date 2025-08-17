import { toast } from "sonner";
import AxiosInstance from "../axios_instance";
import { MessageInterface } from "../interfaces/messages_interface";

export default async function getSessions() {
  const jwt = localStorage.getItem("jwt");
  try {
    debugger;
    const response = await AxiosInstance.post("/chat/get_sessions", {
      jwt: jwt,
    });
    return response.data;
  } catch (e) {
    toast.error("Failed to get sessions");
    throw new Error("Failed to get sessions");
  }
}

export async function getMessages(sessionId: string) {
  try {
    const jwt = localStorage.getItem("jwt");
    const response = await AxiosInstance.post("/chat/get_messages", {
      jwt: jwt,
      sessionId: sessionId,
    });

    return response.data;
  } catch (e) {
    toast.error("failed to load messages");
  }
}

export async function sendMessage(
  sessionId: string, 
  query: string, 
  onChunk?: (chunk: string) => void,
  onComplete?: (fullResponse: string) => void,
  onError?: (error: string) => void
) {
  try {
    const jwt = localStorage.getItem("jwt");
    
    // Create EventSource-like functionality using fetch
    const response = await fetch('http://localhost:5001/chat/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: jwt,
        sessionId: sessionId,
        query: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data.trim()) {
              try {
                const parsedData = JSON.parse(data);
                
                if (parsedData.type === 'token' && parsedData.token) {
                  fullResponse += parsedData.token;
                  onChunk?.(parsedData.token);
                } else if (parsedData.type === 'complete') {
                  onComplete?.(fullResponse);
                  return {
                    content: fullResponse,
                    type: 'ai',
                    sessionId: sessionId,
                    created_at: new Date().toISOString(),
                    id: Date.now().toString()
                  } as MessageInterface;
                } else if (parsedData.type === 'error') {
                  onError?.(parsedData.message);
                  throw new Error(parsedData.message);
                }
              } catch (parseError) {
                // If not JSON, treat as plain text chunk
                fullResponse += data;
                onChunk?.(data);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // If we reach here without completion signal, return the accumulated response
    onComplete?.(fullResponse);
    return {
      content: fullResponse,
      type: 'ai',
      sessionId: sessionId,
      created_at: new Date().toISOString(),
      id: Date.now().toString()
    } as MessageInterface;

  } catch (e) {
    console.error('Streaming error:', e);
    onError?.(e instanceof Error ? e.message : 'Failed to send message');
    toast.error("Failed to send message");
    throw e;
  }
}
