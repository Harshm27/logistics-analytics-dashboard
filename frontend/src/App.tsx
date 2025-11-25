import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import { useToast } from './contexts/ToastContext';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;

