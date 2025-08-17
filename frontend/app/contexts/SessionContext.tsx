'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SessionInterface } from '@/app/lib/axios/interfaces/session_interface';
import getSessions from '@/app/lib/axios/chat/get_sessions';

interface SessionContextType {
  sessions: SessionInterface[];
  isLoading: boolean;
  refreshSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<SessionInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const allSessions = await getSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, isLoading, refreshSessions }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
