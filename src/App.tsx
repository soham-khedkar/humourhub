import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { Gallery } from './pages/Gallery';
import Profile from './pages/Profile';
import MemeEditor from './pages/MemeEditor';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><MemeEditor/></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute><Privacy/></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute><Terms/></ProtectedRoute>} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;