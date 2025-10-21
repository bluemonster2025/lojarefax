"use client";

import { useState, useRef, useEffect } from "react";

interface SwingEditorProps {
  initialContent?: string;
}

export default function SwingEditor({ initialContent = "" }: SwingEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>(initialContent);

  useEffect(() => {
    setContent(initialContent); // se mudar no pai, atualiza
  }, [initialContent]);

  const toggleBold = () => {
    document.execCommand("bold", false, "");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-4 border rounded shadow-lg bg-white">
      {/* Botão Bold */}
      <div className="mb-4">
        <button
          type="button"
          onClick={toggleBold}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Bold
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      {/* Preview */}
      {/* <div className="mt-4 p-2 border rounded bg-gray-50">
        <h3 className="font-bold mb-2">Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div> */}
    </div>
  );
}
