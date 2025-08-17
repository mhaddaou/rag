'use client'

import { SessionInterface } from "@/app/lib/axios/interfaces/session_interface";
import { useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from "@/app/contexts/SessionContext";

// Icons as components for better performance and customization
const ChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EmptyStateIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Skeleton loader component
const SessionSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-slate-100 rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded-md w-2/3 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export default function SideBarChat() {
  const { sessions, isLoading, refreshSessions } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleNewChat = () => {
    router.push('/c');
  };

  const isActiveSession = (sessionId: string) => {
    return pathname === `/c/${sessionId}`;
  };

  return (
    <div className="h-full flex flex-col bg-black/5  shadow-2xl shadow-slate-400">
      {/* Modern Header with Glass Effect */}
      <div className="flex-shrink-0 p-5 border-b border-slate-300/60 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ChatIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Conversations</h2>
              <p className="text-xs text-slate-500">Your chat history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-semibold shadow-sm">
              {sessions.length}
            </span>
          </div>
        </div>
        
        {/* Enhanced New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-600/30 group transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <PlusIcon className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="font-semibold">Start New Chat</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Enhanced Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {isLoading ? (
          // Enhanced Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 mb-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded-lg w-2/3 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded-lg w-1/3"></div>
                  </div>
                  <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : sessions.length === 0 ? (
          // Enhanced Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <EmptyStateIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 text-sm font-semibold mb-2">No conversations yet</p>
            <p className="text-slate-400 text-xs leading-relaxed">Start a new chat to begin<br />your AI conversation</p>
            <div className="mt-4 w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
        ) : (
          // Enhanced Sessions list
          sessions.map((session, index) => {
            const isActive = isActiveSession(session.id);
            
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => router.push(`/c/${session.id}`)}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-50 to-purple-50/50 border-2 border-indigo-200/60 shadow-lg shadow-indigo-100/50'
                    : 'bg-gradient-to-br from-white to-slate-50/50 border border-slate-100/60 hover:border-indigo-200/40 hover:shadow-lg hover:shadow-slate-200/50 backdrop-blur-sm'
                }`}
              >
                {/* Modern Active indicator */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                  </>
                )}
                
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex-1 min-w-0">
                    {/* Enhanced Session title */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-400'
                      } transition-colors duration-200`}></div>
                      <div className={`font-semibold text-sm truncate ${
                        isActive ? 'text-indigo-800' : 'text-slate-800 group-hover:text-slate-900 '
                      }`}>
                        Session #{session.id}
                      </div>
                    </div>
                    
                    {/* Enhanced Session metadata */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`truncate font-medium ${
                        isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-600'
                      }`}>
                        {formatDate(session.created_at)}
                      </span>
                      
                      {/* Enhanced Messages count badge */}
                      {session.messages && session.messages.length > 0 && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          isActive 
                            ? 'bg-indigo-200/60 text-indigo-800 shadow-sm' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                          {session.messages.length}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Status indicators */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {session.docs && session.docs.length > 0 && (
                      <div className={`w-2 h-2 rounded-full shadow-sm ${
                        isActive ? 'bg-emerald-400' : 'bg-emerald-400 group-hover:bg-emerald-500'
                      }`} 
                      title="Has documents"></div>
                    )}
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-100 shadow-sm' 
                        : 'bg-slate-100 group-hover:bg-slate-200 group-hover:shadow-sm'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isActive 
                          ? 'bg-indigo-600' 
                          : 'bg-slate-400 group-hover:bg-slate-500'
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Subtle glow effect for active session */}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-2xl blur opacity-75"></div>
                )}
              </button>
            );
          })
        )}
      </div>
      
      {/* Enhanced Footer */}
      {sessions.length > 0 && !isLoading && (
        <div className="flex-shrink-0 p-4 border-t border-slate-100/60 bg-gradient-to-r from-white/70 to-slate-50/70 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span className="font-medium">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''} total
            </span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}