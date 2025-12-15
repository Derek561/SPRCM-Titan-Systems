"use client";

import { useState } from "react";
import OverviewPanel from "./OverviewPanel";
import NotesPanel from "./NotesPanel";
import HistoryPanel from "./HistoryPanel";

/* -----------------------------
   Types
----------------------------- */

export type ResidentForTabs = {
  id: string;
  full_name: string;
  status: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  discharge_date: string | null;
  discharge_reason: string | null;
};

export type NoteForTabs = {
  id: string;
  content: string;
  created_at: string;
};

export type ResidentTaskForTabs = {
  id: string;
  due_date: string | null;
  status: string;
};

type Props = {
  resident: ResidentForTabs;
  notes: NoteForTabs[];
  tasks: ResidentTaskForTabs[];
  onNoteAdded: (note: NoteForTabs) => void;
};

/* -----------------------------
   Tabs
----------------------------- */

const tabs = ["Overview", "Notes", "History"] as const;
type TabKey = (typeof tabs)[number];

export default function ResidentTabs({
  resident,
  notes,
  tasks,
  onNoteAdded,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900">
      {/* Tab strip */}
      <div className="border-b border-slate-800 px-4 pt-3">
        <div className="flex gap-4 text-sm">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 ${
                  isActive
                    ? "border-orange-500 text-slate-100"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel body */}
      <div className="p-6">
        {activeTab === "Overview" && (
          <OverviewPanel resident={resident} notes={notes} tasks={tasks} />
        )}

        {activeTab === "Notes" && (
          <NotesPanel
            residentId={resident.id}
            notes={notes}
            onNoteAdded={onNoteAdded}
          />
        )}

        {activeTab === "History" && (
          <HistoryPanel resident={resident} notes={notes} tasks={tasks} />
        )}
      </div>
    </section>
  );
}
