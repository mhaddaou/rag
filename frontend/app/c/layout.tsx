import SideBarChat from "@/components/chat/sidebar";
import AppBar from "@/components/main/navbar";
import { SessionProvider } from "../contexts/SessionContext";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="w-screen h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 overflow-hidden">
        <div className="flex-1 h-full flex">
          {/* Enhanced Sidebar Container with Modern Border */}
          <div className="w-[18%] relative">
            {/* Glass morphism border effect */}
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-slate-50/30 pointer-events-none"></div>
            
            {/* Sidebar Content */}
            <div className="h-full relative z-10 ">
              <SideBarChat />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className=" flex-1 flex flex-col">
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/20 to-transparent pointer-events-none w-8"></div>
            <div className="h-full w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
