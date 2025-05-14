import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AIChatPage from './pages/AIChatPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import TablesPage from './pages/TablesPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { Suspense } from 'react';
import './App.css'

function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-custom py-4 px-4 sm:px-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🍽️</div>
        </div>
        <p className="text-text-muted">Loading content...</p>
      </div>
    </div>
  );
}

function App() {
  const { user, loading, error } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="relative w-24 h-24 mb-6">
        <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🍽️</div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Cravely</h1>
      <p className="text-text-muted text-center max-w-xs">Transforming restaurant operations and enhancing customer experiences</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-error mb-6">⚠️</div>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Authentication Error</h1>
      <p className="text-text-muted text-center max-w-md mb-4">{error}</p>
      <p className="text-text-muted text-center max-w-md">Please check your Firebase configuration or network connection.</p>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route element={user ? <MainLayout /> : <Navigate to="/auth" replace />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/chat" element={<AIChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
