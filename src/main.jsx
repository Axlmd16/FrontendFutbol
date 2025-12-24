/**
 * ==============================================
 * Entry Point - Kallpa UNL
 * ==============================================
 * 
 * Punto de entrada de la app React.
 * - Monta React en #root
 * - Importa estilos globales (Tailwind/DaisyUI)
 * 
 * Nota: Este proyecto usa SOLO JavaScript/JSX (sin TypeScript).
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
