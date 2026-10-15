
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { WorkoutsProvider } from './WorkoutsContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkoutsProvider>
      <App />
    </WorkoutsProvider>
  </StrictMode>
);
