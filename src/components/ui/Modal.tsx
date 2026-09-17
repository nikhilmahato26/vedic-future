"use client";

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleClose = () => {
      onClose();
    };
    
    dialog?.addEventListener('close', handleClose);
    return () => dialog?.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog 
      ref={dialogRef}
      className="backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm rounded-[var(--radius-card)] p-0 w-full max-w-md fixed inset-0 m-auto shadow-2xl border border-cream-200 bg-cream-50 open:animate-in open:fade-in-0 open:zoom-in-95"
      onClick={(e) => {
        // Close if clicking on the backdrop
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex flex-col max-h-[90vh]">
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
    </dialog>
  );
}
