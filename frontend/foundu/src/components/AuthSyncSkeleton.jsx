import React from "react";

const AuthSyncSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#020024] flex overflow-hidden">
      {/* Sidebar Shell */}
      <div className="hidden lg:block w-[280px] h-screen bg-white/[0.02] border-r border-white/[0.05] p-10 box-border">
        <div className="w-[120px] h-8 bg-white/[0.05] rounded-xl mb-[60px] animate-pulse"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full h-5 bg-white/[0.03] rounded-lg mb-6 opacity-50 animate-pulse"></div>
        ))}
      </div>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Nav Shell */}
        <div className="h-20 w-full bg-white/[0.01] border-bottom border-white/[0.05] flex items-center justify-between px-10 box-border">
          <div className="w-[200px] h-6 bg-white/[0.05] rounded-lg animate-pulse"></div>
          <div className="w-12 h-12 bg-white/[0.05] rounded-full animate-pulse"></div>
        </div>

        {/* Page Content Shell */}
        <div className="p-10 flex-1 overflow-hidden">
          <div className="w-[300px] h-12 bg-white/[0.05] rounded-2xl mb-10 animate-pulse"></div>
          
          {/* Stats Grid Shell */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[140px] bg-blue-500/[0.03] rounded-[24px] border border-white/[0.06] p-6 box-border">
                <div className="w-10 h-10 bg-white/[0.05] rounded-xl mb-4 animate-pulse"></div>
                <div className="w-[100px] h-5 bg-white/[0.05] rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Large Content Shell */}
          <div className="h-[400px] w-full bg-blue-400/[0.02] rounded-[40px] border border-white/[0.05] p-10 box-border relative overflow-hidden">
             <div className="w-[200px] h-8 bg-white/[0.05] rounded-xl mb-8 animate-pulse"></div>
             <div className="space-y-4">
                <div className="w-full h-3 bg-white/[0.03] rounded-full animate-pulse opacity-30"></div>
                <div className="w-[95%] h-3 bg-white/[0.03] rounded-full animate-pulse opacity-30"></div>
                <div className="w-[90%] h-3 bg-white/[0.03] rounded-full animate-pulse opacity-30"></div>
             </div>
             
             {/* Shimmering Glow Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default AuthSyncSkeleton;
