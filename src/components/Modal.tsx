import { X } from 'lucide-react';

type ModalProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, subtitle, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17211d]/30 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="w-full max-w-lg rounded-t-3xl bg-[#fbfcfa] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-[-.05em]">{title}</h2>
            <p className="mt-1 text-sm text-[#829087]">{subtitle}</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
