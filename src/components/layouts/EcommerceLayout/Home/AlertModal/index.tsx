"use client";

import { getSiteConfig } from "@/lib/getSiteConfig.client";
import { SiteConfig } from "@/types/siteConfig";
import { useState, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";

export default function AlertModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Busca dados de configuração ao montar o componente
    getSiteConfig().then((data) => {
      if (data?.notificationEnabled) {
        setConfig(data);
      } else {
        setIsOpen(false); // não renderiza se notificação estiver desativada
      }
    });
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  if (!isOpen || !config) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-[90%] p-5 relative animate-fadeIn"
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Fechar aviso"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <IoIosClose size={28} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">ATENÇÃO</h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          {config.notificationMessage}
        </p>

        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-md px-4 py-3 mt-4 flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mt-[2px] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">
            Se você não conseguir entrar em contato via WhatsApp, ligue para:{" "}
            <strong>(11) 0000-0000.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
