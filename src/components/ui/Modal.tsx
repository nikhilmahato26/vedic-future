"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md bg-cream-50 rounded-[var(--radius-card)] shadow-2xl border border-cream-200 animate-in fade-in-0 zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <h2 className="font-display text-xl font-bold text-navy-900">{title}</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-cream-100 text-navy-900 hover:bg-coral/20 hover:text-coral transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
