
import React, { useState, useEffect } from 'react';
import { User, Screen } from './types';
import LoginScreen from './screens/LoginScreen';
import ClientDashboard from './screens/ClientDashboard';
import NewMusicScreen from './screens/NewMusicScreen';
import AdminScreen from './screens/AdminScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [autoShowOrders, setAutoShowOrders] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('warmverse_active_session');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      if (user.isAdmin) {
        setCurrentScreen('Admin');
      } else {
        setCurrentScreen('Dashboard');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('warmverse_active_session', JSON.stringify(user));
    if (user.isAdmin) {
      setCurrentScreen('Admin');
    } else {
      setCurrentScreen('Dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('warmverse_active_session');
    setCurrentScreen('Login');
  };

  const navigateTo = (screen: Screen, showOrders: boolean = false) => {
    setAutoShowOrders(showOrders);
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm border-b border-blue-100 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => currentUser?.isAdmin ? navigateTo('Admin') : navigateTo('Dashboard')}
        >
          <div className="w-10 h-10 warm-gradient rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">W</div>
          <h1 className="text-2xl font-serif tracking-tight text-slate-800">Warmverse</h1>
        </div>
        {currentUser && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">
              {currentUser.name}
            </span>
            <button 
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        {currentScreen === 'Login' && <LoginScreen onLogin={handleLogin} />}
        {currentScreen === 'Dashboard' && currentUser && (
          <ClientDashboard 
            user={currentUser} 
            onCreateNew={() => navigateTo('NewMusic')}
            initialShowOrders={autoShowOrders}
          />
        )}
        {currentScreen === 'NewMusic' && currentUser && (
          <NewMusicScreen 
            user={currentUser} 
            onBack={(showOrders) => navigateTo('Dashboard', showOrders)} 
          />
        )}
        {currentScreen === 'Admin' && currentUser?.isAdmin && (
          <AdminScreen />
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs border-top mt-auto">
        &copy; {new Date().getFullYear()} Warmverse AI. Transformando momentos em música.
      </footer>
    </div>
  );
};

export default App;
