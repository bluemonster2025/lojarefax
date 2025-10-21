interface SaveModalProps {
  saved: boolean;
  error: string | null;
}

export function SaveModal({ saved, error }: SaveModalProps) {
  if (!saved && !error) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-transform animate-slide-in"
      style={{ backgroundColor: saved ? "#4CAF50" : "#F44336", color: "#fff" }}
    >
      {saved && <span>✅ Salvo com sucesso!</span>}
      {error && <span>❌ {error}</span>}
    </div>
  );
}
