"use client";

import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { formatDateShort, sourceStyle } from "@/lib/format";
import type { Candidate } from "@/lib/types";

interface CandidateCardProps {
  candidate: Candidate;
  jobTitle: string | undefined;
  onClick: () => void;
  onArchive: (stage: "不採用" | "辞退") => void;
  isDragging?: boolean;
  dragHandleProps?: {
    attributes?: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
  };
  innerRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

export default function CandidateCard({
  candidate,
  jobTitle,
  onClick,
  onArchive,
  isDragging,
  dragHandleProps,
  innerRef,
  style,
}: CandidateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div
      ref={innerRef}
      style={style}
      {...(dragHandleProps?.attributes ?? {})}
      {...(dragHandleProps?.listeners ?? {})}
      onClick={onClick}
      className={clsx(
        "group relative cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="rounded p-0.5 text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute right-0 top-6 z-20 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onArchive("辞退");
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50"
              >
                辞退にする
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onArchive("不採用");
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50"
              >
                不採用にする
              </button>
            </div>
          )}
        </div>
      </div>

      {jobTitle && (
        <p className="mt-0.5 truncate text-xs text-slate-500">{jobTitle}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
            sourceStyle(candidate.source)
          )}
        >
          {candidate.source}
        </span>
        <span className="text-[11px] text-slate-400">
          {formatDateShort(candidate.appliedAt)}
        </span>
      </div>
    </div>
  );
}
