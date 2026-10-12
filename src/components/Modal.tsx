import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badgeText?: string;
  actionText?: string;
  onAction?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  badgeText,
  actionText = 'Return to sign in',
  onAction,
  cancelText,
  onCancel,
  children,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#062B50]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8F3FF] p-6 sm:p-7 z-10 transition-all transform animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {badgeText && (
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#0866C6] mb-1.5">
                {badgeText}
              </span>
            )}
            <h2
              id="modal-title"
              className="text-xl font-bold text-[#062B50] tracking-tight"
            >
              {title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {description && (
          <p
            id="modal-description"
            className="text-[15px] sm:text-base leading-relaxed text-[#64778C] mb-6"
          >
            {description}
          </p>
        )}

        {children && <div className="mb-6">{children}</div>}

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel || onClose}
              className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#062B50] font-semibold text-sm sm:text-base active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction();
              else onClose();
            }}
            className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-[#0866C6] text-white font-semibold text-sm sm:text-base hover:bg-[#062B50] active:scale-[0.98] transition-all flex items-center justify-center shadow-sm focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};
