"use client";

import { FolderKanban, ListTodo, ChevronDown } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-[150px] min-h-screen border-r border-[#E5E5E5] bg-white">
      {/* Workspace Header */}
      <div className="h-[55px] border-b border-[#E5E5E5] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dexter Avatar */}
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-[9px] font-medium text-white">D</span>
          </div>

          <span className="text-[11px] font-semibold text-[#111111]">
            Dexter
          </span>
        </div>

        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className="text-[#555555]"
        />
      </div>

      {/* Navigation */}
      <div className="px-3 pt-4">
        {/* Workspace */}
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-[9px] font-medium text-[#777777]">
            Workspace
          </p>

          <ChevronDown
            size={11}
            strokeWidth={1.5}
            className="text-[#333333]"
          />
        </div>

        <nav className="space-y-1">
          {/* Tasks */}
          <a
            href="/tasks"
            className="flex h-[32px] items-center gap-2 rounded-md bg-[#F2F2F2] px-2 text-[10px] font-medium text-[#111111]"
          >
            <ListTodo
              size={13}
              strokeWidth={1.5}
              className="text-[#222222]"
            />

            <span>Tasks</span>
          </a>

          {/* Projects */}
          <a
            href="/projects"
            className="flex h-[32px] items-center gap-2 rounded-md px-2 text-[10px] font-medium text-[#333333] hover:bg-[#F5F5F5]"
          >
            <FolderKanban
              size={13}
              strokeWidth={1.5}
              className="text-[#555555]"
            />

            <span>Projects</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}