import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.9rem 1.4rem',
        borderRadius: 'var(--radius-lg)',
        background: '#0F172A',
        border: '1px solid rgba(37, 99, 235, 0.4)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25), 0 0 25px rgba(37, 99, 235, 0.2)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: '#F8FAFC',
        fontSize: '0.92rem',
        fontWeight: 600,
        animation: 'modalScale 0.25s var(--ease-spring)',
      }}
    >
      <Sparkles size={18} color="var(--accent-cyan)" />
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '0.5rem',
          color: 'var(--text-muted)',
          background: 'none',
          cursor: 'pointer',
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
