import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const syntaxHighlight = (code: string, language: string): string => {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings
  highlighted = highlighted.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-emerald-400">$&</span>');
  // Comments
  highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="text-slate-500">$&</span>');
  // Keywords
  const keywords = ['import', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'def', 'print', 'async', 'await', 'export', 'default', 'new', 'try', 'catch', 'throw', 'response', 'requests'];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="text-purple-400">$&</span>');
  });
  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$&</span>');
  // Brackets
  highlighted = highlighted.replace(/([{}[\]()])/g, '<span class="text-sky-300">$&</span>');

  return highlighted;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', title, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-slate-700/50 bg-[#0d1117] ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-slate-400 ml-2 font-mono">{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700/50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <div className="relative group">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code
            className="font-mono text-slate-300"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(code, language) }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
