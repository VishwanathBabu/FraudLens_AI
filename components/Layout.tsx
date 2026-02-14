
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`${isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-slate-900'} text-white shadow-lg sticky top-0 z-50 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">FraudLens <span className="text-blue-400">AI</span></h1>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <nav className="hidden md:flex space-x-6 text-xs font-medium uppercase tracking-widest opacity-70">
              <span>Kartik2112</span>
              <span>Gemini 3 Flash</span>
            </nav>
            
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-blue-400' : 'text-slate-400'}`}>
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
              <button 
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-10 sm:h-7 sm:w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  isDarkMode ? 'bg-blue-600' : 'bg-slate-600'
                }`}
                aria-label="Toggle dark mode"
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                    isDarkMode ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        {children}
      </main>

      <footer className={`border-t py-6 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center text-xs sm:text-sm font-medium">
          &copy; {new Date().getFullYear()} FraudLens AI Detection. Advanced Real-Time Financial Security.
        </div>
      </footer>
    </div>
  );
};
