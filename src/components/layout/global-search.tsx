"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Phone, User, Briefcase } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'contact' | 'case';
  name: string;
  phone?: string | null;
  email?: string | null;
  caseNumber?: string;
  subtitle?: string;
}

export function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setResults([]);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const [contactsRes, casesRes] = await Promise.all([
        fetch(`/api/contacts?search=${encodeURIComponent(q)}`),
        fetch(`/api/cases?search=${encodeURIComponent(q)}`),
      ]);
      const contacts = contactsRes.ok ? await contactsRes.json() : [];
      const cases = casesRes.ok ? await casesRes.json() : [];

      const mapped: SearchResult[] = [
        ...contacts.slice(0, 5).map((c: any) => ({
          id: c.id,
          type: 'contact' as const,
          name: `${c.firstName} ${c.lastName}`,
          phone: c.phone,
          email: c.email,
          subtitle: c.type?.replace(/_/g, ' '),
        })),
        ...cases.slice(0, 5).map((c: any) => ({
          id: c.id,
          type: 'case' as const,
          name: c.title,
          caseNumber: c.caseNumber,
          subtitle: c.stage?.replace(/_/g, ' '),
        })),
      ];
      setResults(mapped);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  const goTo = (result: SearchResult) => {
    router.push(result.type === 'case' ? `/cases/${result.id}` : `/contacts/${result.id}`);
    close();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-start justify-center pt-24 px-4"
      onClick={close}
    >
      <div
        className="bg-[#0D1421] border border-[#1a2332] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-3.5 border-b border-[#1a2332]">
          <Search className="h-4 w-4 text-slate-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search cases or contacts…"
            className="flex-1 text-sm outline-none bg-transparent text-white placeholder:text-slate-600"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); }} className="text-slate-600 hover:text-slate-400">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center px-1.5 py-0.5 bg-[#111827] border border-[#1a2332] rounded text-[10px] text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto divide-y divide-[#111827]">
            {results.map(result => (
              <li key={`${result.type}-${result.id}`}>
                <button
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#111827] transition-colors text-left"
                  onClick={() => goTo(result)}
                >
                  <div className="p-1.5 bg-[#111827] rounded-lg shrink-0">
                    {result.type === 'case'
                      ? <Briefcase className="h-3.5 w-3.5 text-[#C9A84C]" />
                      : <User className="h-3.5 w-3.5 text-slate-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{result.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {result.caseNumber && (
                        <span className="text-[10px] font-data text-[#C9A84C]">{result.caseNumber}</span>
                      )}
                      {result.phone && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <Phone className="h-2.5 w-2.5" />{result.phone}
                        </span>
                      )}
                      {result.subtitle && (
                        <span className="text-[10px] text-slate-600">{result.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {loading && (
          <div className="p-6 text-center text-[11px] text-slate-600">Searching…</div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-[11px] text-slate-600">
            No results for "{query}"
          </div>
        )}

        <div className="px-3.5 py-2 border-t border-[#111827] flex items-center justify-between text-[10px] text-slate-700">
          <span>Cases · Contacts</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[#111827] border border-[#1a2332] rounded font-mono">⌘K</kbd>
            to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
