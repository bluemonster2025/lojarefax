"use client";

import { useRef, useState, useEffect } from "react";

interface EditorSwingProps {
  value?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

export function EditorSwing({
  value = "",
  maxLength = 250,
  onChange,
}: EditorSwingProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);

  // -----------------------------
  // Sanitiza: mantém apenas <b> e <br>
  // -----------------------------
  const sanitizeHTML = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp.querySelectorAll("strong").forEach((s) => {
      const b = document.createElement("b");
      b.innerHTML = s.innerHTML;
      s.replaceWith(b);
    });

    const walk = (node: ChildNode) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (!["B", "BR"].includes(el.tagName)) {
          const parent = el.parentNode;
          while (el.firstChild) parent?.insertBefore(el.firstChild, el);
          parent?.removeChild(el);
        } else {
          Array.from(el.childNodes).forEach(walk);
        }
      }
    };

    Array.from(temp.childNodes).forEach(walk);
    let cleanHTML = temp.innerHTML;
    cleanHTML = cleanHTML
      .replace(/&(nbsp|#160);/g, " ")
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)+/g, "<br><br>");

    return cleanHTML;
  };

  // Inicializa
  useEffect(() => {
    if (!editorRef.current) return;
    const clean = sanitizeHTML(value);
    editorRef.current.innerHTML = clean || "";
    setCharCount(editorRef.current.innerText.length);
  }, [value]);

  // Atualiza ao mudar o valor externo
  useEffect(() => {
    if (!editorRef.current) return;
    const clean = sanitizeHTML(value);
    if (editorRef.current.innerHTML !== clean) {
      editorRef.current.innerHTML = clean;
      setCharCount(editorRef.current.innerText.length);
    }
  }, [value]);

  // -----------------------------
  // Ações básicas
  // -----------------------------
  const handleInput = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;

    // ✅ corta se passar do limite
    if (text.length > maxLength) {
      editorRef.current.innerText = text.slice(0, maxLength);
      setCharCount(maxLength);
    } else {
      setCharCount(text.length);
    }

    const clean = sanitizeHTML(editorRef.current.innerHTML);
    onChange?.(clean);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const editor = editorRef.current;
    if (!editor) return;

    const currentLength = editor.innerText.length;
    const remaining = maxLength - currentLength;

    if (remaining <= 0) return;

    document.execCommand("insertText", false, text.slice(0, remaining));
    handleInput();
  };

  const execCommand = (command: "bold") => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false);
    handleInput();
  };

  // -----------------------------
  // Inserir <br><br> corretamente
  // -----------------------------
  const insertLineBreakAtCursor = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      editor.focus();
      document.execCommand("insertHTML", false, "<br><br>");
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const br1 = document.createElement("br");
    const br2 = document.createElement("br");

    range.insertNode(br2);
    range.insertNode(br1);

    const newRange = document.createRange();
    newRange.setStartAfter(br2);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);
    editor.focus();
  };

  // -----------------------------
  // Teclas
  // -----------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const editor = editorRef.current;
    if (!editor) return;

    const length = editor.innerText.length;

    // Bloqueia novas inserções se atingir o limite
    const controlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Enter",
    ];

    if (
      length >= maxLength &&
      !e.ctrlKey &&
      !e.metaKey &&
      !controlKeys.includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    // Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      execCommand("bold");
      return;
    }

    // Enter
    if (e.key === "Enter") {
      e.preventDefault();
      insertLineBreakAtCursor();
      setTimeout(handleInput, 0);
    }
  };

  const handleBlur = () => {
    if (!editorRef.current) return;
    const clean = sanitizeHTML(editorRef.current.innerHTML);
    editorRef.current.innerHTML = clean;
    onChange?.(clean);
  };

  return (
    <div className="relative border border-gray-300 rounded p-2 bg-white">
      {/* Toolbar */}
      <div className="mb-4 border-b border-gray-200">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-sm font-bold cursor-pointer"
          onClick={() => execCommand("bold")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
          >
            <path
              d="M12.7084 10.3334C13.1164 10.085 13.4607 9.7446 13.7139 9.33949C13.9671 8.93438 14.1221 8.47572 14.1667 8.00008C14.1744 7.56998 14.0973 7.14258 13.9399 6.74227C13.7824 6.34197 13.5476 5.97661 13.2489 5.66707C12.9502 5.35753 12.5934 5.10987 12.199 4.93823C11.8045 4.76659 11.3801 4.67434 10.95 4.66675H5.54169V16.3334H11.375C11.7843 16.3291 12.1887 16.2441 12.5652 16.0835C12.9417 15.9228 13.2828 15.6896 13.5691 15.397C13.8554 15.1045 14.0813 14.7585 14.2339 14.3787C14.3865 13.9989 14.4628 13.5927 14.4584 13.1834V13.0834C14.4586 12.506 14.2941 11.9405 13.9841 11.4534C13.6741 10.9662 13.2315 10.5777 12.7084 10.3334ZM7.20835 6.33341H10.7084C11.0635 6.32242 11.4135 6.42032 11.7114 6.61396C12.0093 6.8076 12.2409 7.08773 12.375 7.41675C12.5107 7.85657 12.4669 8.33224 12.2529 8.73979C12.039 9.14735 11.6724 9.45365 11.2334 9.59175C11.0628 9.64172 10.886 9.66698 10.7084 9.66675H7.20835V6.33341ZM11.0417 14.6667H7.20835V11.3334H11.0417C11.3968 11.3224 11.7468 11.4203 12.0448 11.614C12.3427 11.8076 12.5742 12.0877 12.7084 12.4167C12.8441 12.8566 12.8002 13.3322 12.5863 13.7398C12.3723 14.1473 12.0058 14.4536 11.5667 14.5917C11.3962 14.6417 11.2194 14.667 11.0417 14.6667Z"
              fill="#282828"
            />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[100px] outline-none whitespace-pre-wrap break-words"
        style={{ margin: 0, padding: 0, lineHeight: "1.4" }}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        suppressContentEditableWarning
      />

      {/* Contador */}
      <div className="text-right text-xs text-gray-500 mt-1">
        {charCount}/{maxLength}
      </div>
    </div>
  );
}
