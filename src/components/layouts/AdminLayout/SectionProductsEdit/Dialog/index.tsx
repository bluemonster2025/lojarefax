import { ReactNode, HTMLAttributes } from "react";

interface DialogProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export function Dialog({ children, open, onClose }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return <div className={`mb-4 ${className || ""}`}>{children}</div>;
}

interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>
  );
}

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return <div className={className}>{children}</div>;
}
