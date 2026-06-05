import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, FileText, Loader2, Trash2, Plus } from "lucide-react";
import { BrandMark } from "~/scripts/components/brand-mark";
import { listScripts, deleteScript } from "~/scripts/scripts.client";
import type { ScriptRecord } from "~/scripts/scripts.types";

export function meta() {
  return [{ title: "Library — AnchorFlow" }];
}

export default function LibraryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ScriptRecord[] | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    listScripts()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setDeleting(id);
    try {
      await deleteScript(id);
      setItems((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
    } catch {
      /* ignore */
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-10 border-b border-[#ECECEC] bg-[#FAFAFA]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:bg-white hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Studio</span>
          </button>
          <BrandMark compact />
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--primary)" }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[#111111]">
          Your scripts
        </h1>

        {items === null ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#9CA3AF]" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-[#D1D5DB]" />
            <p className="text-[15px] font-medium text-[#374151]">No scripts yet</p>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Generate your first anchor script to see it here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              Create a script
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/editor/${s.id}`)}
                className="af-fade-up group flex w-full items-start gap-4 rounded-2xl border border-[#ECECEC] bg-white p-5 text-left shadow-sm transition-all hover:border-[#D8D9F5] hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold text-[#111111]">
                    {s.title || "Untitled script"}
                  </p>
                  {s.generated_summary && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#6B7280]">
                      {s.generated_summary}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#9CA3AF]">
                    <span className="rounded-full bg-[#F4F4F5] px-2 py-0.5">{s.tone}</span>
                    <span className="rounded-full bg-[#F4F4F5] px-2 py-0.5">{s.duration}</span>
                    {s.estimated_reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {s.estimated_reading_time}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  onClick={(e) => handleDelete(e, s.id)}
                  className="shrink-0 rounded-lg p-2 text-[#C4C4C8] opacity-0 transition-all hover:bg-[#FEF2F2] hover:text-[#EF4444] group-hover:opacity-100"
                  aria-label="Delete script"
                  role="button"
                >
                  {deleting === s.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
