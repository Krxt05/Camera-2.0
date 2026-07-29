import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminQueue from './components/AdminQueue';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const isAdminPage = window.location.pathname.replace(/\/$/, '') === '/admin';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isAdminPage ? <AdminQueue /> : <App />}
  </React.StrictMode>
);