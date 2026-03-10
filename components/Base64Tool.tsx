'use client';
import { useState } from 'react';

type InputMode = 'text' | 'file';
type Direction = 'encode' | 'decode';

function CopyBtn({ value }: { value: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500); }}
      className="p-2 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
      {c ? <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
    </button>
  );
}

export default function Base64Tool() {
  const [direction, setDirection] = useState<Direction>('encode');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);

  function toBase64(str: string, safe: boolean): string {
    const encoded = btoa(unescape(encodeURIComponent(str)));
    return safe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : encoded;
  }

  function fromBase64(str: string): string {
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return decodeURIComponent(escape(atob(padded)));
  }

  const process = () => {
    setError('');
    if (inputMode === 'file' && fileDataUrl) {
      setOutput(fileDataUrl);
      return;
    }
    try {
      if (direction === 'encode') {
        setOutput(toBase64(input, urlSafe));
      } else {
        setOutput(fromBase64(input));
      }
    } catch {
      setError('Invalid Base64 input. Make sure the string is properly encoded.');
      setOutput('');
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileDataUrl(result);
      setOutput(result);
    };
    reader.readAsDataURL(file);
  };

  const downloadDecoded = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'decoded.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setDirection(d => d === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Controls */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Direction */}
        <div className="flex gap-2">
          {(['encode', 'decode'] as Direction[]).map(d => (
            <button key={d} onClick={() => { setDirection(d); setInput(''); setOutput(''); setError(''); }}
              className={`flex-1 py-3 rounded-xl border font-black text-sm tracking-widest uppercase transition-all ${direction === d ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-teal-400'}`}>
              {d === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </button>
          ))}
        </div>

        {/* Input mode (encode only) */}
        {direction === 'encode' && (
          <div className="flex gap-2">
            {(['text', 'file'] as InputMode[]).map(m => (
              <button key={m} onClick={() => { setInputMode(m); setInput(''); setOutput(''); setFileName(''); setFileDataUrl(''); }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${inputMode === m ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-teal-400'}`}>
                {m === 'text' ? '📝 Text' : '📁 File / Image'}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        {direction === 'encode' && inputMode === 'file' ? (
          <label className="block border-2 border-dashed border-gray-200 dark:border-[#2a2a2a] hover:border-teal-400 dark:hover:border-teal-700 rounded-xl p-8 text-center cursor-pointer transition-colors">
            <input type="file" onChange={handleFile} className="hidden" />
            {fileName ? (
              <div><p className="text-teal-600 dark:text-teal-400 font-bold">{fileName}</p><p className="text-xs text-gray-400 mt-1">Click to change file</p></div>
            ) : (
              <div>
                <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">Drop a file or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Any file type — encodes to base64 Data URL</p>
              </div>
            )}
          </label>
        ) : (
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={direction === 'encode' ? 'Enter text to encode…' : 'Paste Base64 string to decode…'}
            rows={5}
            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 resize-none transition-colors" />
        )}

        {direction === 'encode' && inputMode === 'text' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setUrlSafe(!urlSafe)} className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${urlSafe ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${urlSafe ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">URL-safe (RFC 4648 §5) — replaces +/= with -_</span>
          </label>
        )}

        <div className="flex gap-2">
          <button onClick={process} disabled={!input.trim() && !fileDataUrl}
            className="flex-1 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white font-black text-base transition-all shadow-lg shadow-teal-600/30">
            {direction === 'encode' ? 'Encode →' : 'Decode →'}
          </button>
          {output && (
            <button onClick={swap} title="Swap input/output" className="px-4 py-4 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 text-sm text-red-600 dark:text-red-400 font-medium">{error}</div>
      )}
      {output && !error && (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Output</p>
              <p className="text-xs text-gray-400">{output.length.toLocaleString()} characters</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyBtn value={output} />
              {direction === 'decode' && (
                <button onClick={downloadDecoded} className="p-2 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              )}
            </div>
          </div>
          <textarea readOnly value={output} rows={6}
            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm font-mono text-gray-900 dark:text-white resize-none focus:outline-none" />
        </div>
      )}
    </div>
  );
}
