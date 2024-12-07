// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './config/supabaseInstance'; // Import the supabase client

import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </SessionContextProvider>
  </StrictMode>
);
