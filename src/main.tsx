import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--surface)',
          color: 'var(--ink)',
          border: '1px solid var(--line)',
          borderRadius: '4px',
          padding: '16px',
          fontSize: '13px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: '280px',
          maxWidth: '380px',
        },
        success: {
          style: {
            background: 'var(--surface)',
            borderLeft: '3px solid var(--safe)',
          },
          iconTheme: {
            primary: 'var(--safe)',
            secondary: 'white',
          },
        },
        error: {
          style: {
            background: 'var(--surface)',
            borderLeft: '3px solid var(--scam)',
          },
          iconTheme: {
            primary: 'var(--scam)',
            secondary: 'white',
          },
        },
        loading: {
          style: {
            background: 'var(--surface)',
            borderLeft: '3px solid #f59e0b',
          },
        },
      }}
    />
    <App />
  </React.StrictMode>,
)