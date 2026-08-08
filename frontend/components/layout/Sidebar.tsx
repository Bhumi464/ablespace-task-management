"use client";

import { FolderKanban, ListTodo, Settings, ChevronDown } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-[#fafafa] min-h-screen">
      {/* Workspace */}
      <div className="h-12 border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-500" />
          <span className="text-xs font-semibold text-gray-800">
            Dexter
          </span>
        </div>

        <ChevronDown size={13} className="text-gray-500" />
      </div>

      {/* Navigation */}
      <div className="px-3 py-4">
        <p className="text-[10px] text-gray-500 mb-2 px-2">
          Workspace
        </p>

        <nav className="space-y-1">
          <a
            href="/tasks"
            className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-2 text-xs text-gray-900"
          >
            <ListTodo size={14} />
            Tasks
          </a>

          <a
            href="/projects"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-gray-600 hover:bg-gray-100"
          >
            <FolderKanban size={14} />
            Projects
          </a>
        </nav>

        <div className="mt-6">
          <a
            href="/settings"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-gray-600 hover:bg-gray-100"
          >
            <Settings size={14} />
            Settings
          </a>
        </div>
      </div>
    </aside>
  );
}