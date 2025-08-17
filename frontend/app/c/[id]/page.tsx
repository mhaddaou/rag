"use client";

import { getMessages, sendMessage } from "@/app/lib/axios/chat/get_sessions";
import { MessageInterface } from "@/app/lib/axios/interfaces/messages_interface";
import React, { useEffect, useState, useRef } from "react";
import "@/styles/chat.css";

// Modern Icons
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BotIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PaperClipIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const MoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

// Format timestamp helper
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Message Component
const MessageBubble = ({ message, isUser }: { message: MessageInterface; isUser: boolean }) => {
  return (
    <div className={`flex items-start gap-3 max-w-4xl mx-auto px-4 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <BotIcon className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col gap-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white ml-12' 
            : 'bg-white border border-slate-200 mr-12'
        }`}>
          <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-800'}`}>
            {message.content}
          </p>
          
          {/* Message tail */}
          <div className={`absolute top-3 w-3 h-3 transform rotate-45 ${
            isUser 
              ? '-right-1 bg-gradient-to-br from-indigo-600 to-purple-600'
              : '-left-1 bg-white border-l border-b border-slate-200'
          }`}></div>
        </div>
        
        
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

// AI Typing Loader Component
const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 max-w-4xl mx-auto px-4 py-4 justify-start">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <BotIcon className="w-4 h-4 text-white" />
      </div>
      
      <div className="flex flex-col gap-2 max-w-2xl items-start">
        <div className="relative px-4 py-3 rounded-2xl shadow-sm bg-white border border-slate-200 mr-12">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          </div>
          
          {/* Message tail */}
          <div className="absolute top-3 w-3 h-3 transform rotate-45 -left-1 bg-white border-l border-b border-slate-200"></div>
        </div>
        
        <div className="text-xs text-slate-400 px-2 text-left">
          AI Assistant • typing...
        </div>
      </div>
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ onSend }: { onSend: (message: string) => void }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // const adjustTextareaHeight = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = 'auto';
  //     textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  //   }
  // };

  return (
    <div className="bg-white/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-200">
            {/* Attachment Button */}

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // adjustTextareaHeight();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-0 outline-none resize-none text-slate-800 placeholder-slate-400 text-sm py-2 max-h-32 min-h-[2.5rem]"
              rows={1}
            />

            {/* Send Button */}
            <button
              type="submit"
              title="Send message"
              aria-label="Send message"
              disabled={!message.trim()}
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                message.trim()
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 '
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Welcome Message Component
const WelcomeMessage = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center  mx-auto ">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
      <BotIcon className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-3">Start a Conversation</h2>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">
      Ask me anything! I'm here to help you with questions, creative tasks, analysis, and more.
    </p>
    <div className="flex flex-wrap gap-2 justify-center">
      {[
        "Explain a concept",
        "Help with coding",
        "Creative writing",
        "Data analysis"
      ].map((suggestion) => (
        <button
          key={suggestion}
          className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const getAllMessages = async (id: string) => {
      try {
        setIsLoading(true);
        const res = await getMessages(id);
        console.log("this is the response", res);
        setMessages(res || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    getAllMessages(id);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async(content: string) => {
    // Add user message immediately for better UX
    const userMessage: MessageInterface = {
      id: Date.now().toString(),
      content,
      type: 'human',
      sessionId: id,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Create a placeholder AI message for streaming (no typing indicator needed)
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: MessageInterface = {
      id: aiMessageId,
      content: '...',  // Show initial dots to indicate loading
      type: 'ai',
      sessionId: id,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    try {
      await sendMessage(
        id, 
        content,
        // onChunk callback - updates the message content as tokens arrive
        (chunk: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: msg.content === '...' ? chunk : msg.content + chunk }
                : msg
            )
          );
        },
        // onComplete callback
        (fullResponse: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: fullResponse }
                : msg
            )
          );
        },
        // onError callback
        (error: string) => {
          console.error('Streaming error:', error);
          // Remove the failed AI message
          setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the failed AI message
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50/50 to-white">
      {/* Messages Area - Fixed height to prevent overlap */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          // Loading State
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <span className="text-sm text-slate-500 ml-3">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <WelcomeMessage />
          </div>
        ) : (
          <div className="h-full overflow-y-auto flex flex-col">
            <div className="flex-1"></div>
            <div className="py-6  min-h-0">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isUser={message.type === 'human'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-slate-200">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
