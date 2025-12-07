import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LearningPathsPage from './pages/LearningPathsPage';
import LearningPathDetailPage from './pages/LearningPathDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLearningPathsPage from './pages/AdminLearningPathsPage';
import AuthModal from './components/AuthModal';
import ChatWidget from './components/ChatWidget';
import { CourseProvider } from './context/CourseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningPathProvider } from './context/LearningPathContext';

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user } = useAuth();

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const ProtectedRoute = ({ children }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="relative min-h-screen">
      <Navbar openAuthModal={openAuthModal} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/learning-paths" element={<LearningPathsPage />} />
        <Route path="/learning-paths/:id" element={<LearningPathDetailPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/learning-paths" 
          element={
            <ProtectedRoute>
              <AdminLearningPathsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <ChatWidget />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <LearningPathProvider>
            <AppContent />
          </LearningPathProvider>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;