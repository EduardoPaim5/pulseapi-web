import React from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 overflow-y-auto px-4 py-6 sm:py-10">
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,35,53,0.55)_0%,rgba(3,20,36,0.65)_100%)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto w-full max-w-lg glass-panel p-6 max-h-[calc(100vh-3rem)] overflow-y-auto sm:max-h-[calc(100vh-5rem)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cyan-50">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(171,223,245,0.24)_100%)] px-3 py-1 text-xs uppercase tracking-wide text-white/90 hover:brightness-110"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
