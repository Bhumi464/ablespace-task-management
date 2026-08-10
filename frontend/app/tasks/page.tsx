"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  Columns2,
  List,
  Plus,
  Search,
  UserRound,
  LayoutGrid,
  PanelLeft,
} from "lucide-react";

import { tasks } from "@/data/tasks";

type ViewMode = "board" | "list";

const columns = [
  {
    title: "To Do",
    status: "To Do",
  },
  {
    title: "Doing",
    status: "Doing",
  },
  {
    title: "Completed",
    status: "Completed",
  },
  {
    title: "On Hold",
    status: "On Hold",
  },
];

export default function TasksPage() {
  const [view, setView] = useState<ViewMode>("board");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchText) ||
        task.member.toLowerCase().includes(searchText) ||
        task.labels.some((label) =>
          label.toLowerCase().includes(searchText)
        )
      );
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-[155px] shrink-0 border-r border-[#E5E5E5] bg-white">

          {/* Dexter */}
          <div className="h-[55px] px-4 flex items-center justify-between border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">

              <div className="w-[21px] h-[21px] rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-[8px] font-medium text-white">
                  D
                </span>
              </div>

              <span className="text-[11px] font-semibold text-[#111111]">
                Dexter
              </span>
            </div>

            <ChevronDown
              size={11}
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
                size={10}
                strokeWidth={1.5}
                className="text-[#333333]"
              />
            </div>

            <nav className="space-y-1">

              {/* Tasks */}
              <Link
                href="/tasks"
                className="flex h-[31px] items-center gap-2 rounded-md bg-[#F2F2F2] px-2 text-[10px] font-medium text-[#111111]"
              >
                <List
                  size={12}
                  strokeWidth={1.6}
                  className="text-[#222222]"
                />

                <span>Tasks</span>
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                className="flex h-[31px] items-center gap-2 rounded-md px-2 text-[10px] font-medium text-[#333333] hover:bg-[#F7F7F7]"
              >
                <LayoutGrid
                  size={12}
                  strokeWidth={1.5}
                  className="text-[#555555]"
                />

                <span>Projects</span>
              </Link>

            </nav>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 min-w-0">

          {/* ================= TOP BAR ================= */}
          <div className="h-[40px] border-b border-[#E5E5E5] flex items-center px-4">

            <button
  type="button"
  className="w-6 h-6 flex items-center justify-center text-[#333333]"
>
  <PanelLeft
    size={13}
    strokeWidth={1.7}
  />
</button>

          </div>

          {/* ================= TASKS HEADER ================= */}
          <header className="h-[52px] border-b border-[#E5E5E5] flex items-center justify-between px-5 bg-white">

            {/* Title */}
            <h1 className="text-[14px] font-semibold text-[#111111]">
              Tasks
            </h1>

            {/* Controls */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <button
                type="button"
                className="w-7 h-7 border border-[#E5E5E5] rounded-md flex items-center justify-center text-[#444444] hover:bg-gray-50"
              >
                <Search
                  size={13}
                  strokeWidth={1.7}
                />
              </button>

              {/* Fields */}
              <button
                type="button"
                className="h-7 px-2.5 border border-[#E5E5E5] rounded-md text-[10px] font-medium text-[#333333] flex items-center gap-1.5 hover:bg-gray-50"
              >
                <Columns2
                  size={12}
                  strokeWidth={1.7}
                />

                <span>Fields</span>
              </button>

              {/* Filter */}
              <button
                type="button"
                className="w-7 h-7 border border-[#E5E5E5] rounded-md flex items-center justify-center text-[#444444] hover:bg-gray-50"
              >
                <Filter
                  size={12}
                  strokeWidth={1.7}
                />
              </button>

              {/* Add Task */}
              <button
                type="button"
                className="h-7 px-3 rounded-md bg-black text-white text-[10px] font-medium flex items-center gap-1.5 hover:bg-[#222222]"
              >
                <Plus size={12} />
                <span>Add Task</span>
              </button>

            </div>
          </header>

          {/* ================= BOARD ================= */}
          {view === "board" && (
            <div className="w-full px-4 py-4">

              {/* Full width board */}
              <div className="grid grid-cols-4 gap-2.5 w-full">

                {columns.map((column) => {
                  const columnTasks = filteredTasks.filter(
                    (task) => task.status === column.status
                  );

                  return (
                    <div
                      key={column.status}
                      className="min-w-0 w-full bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg p-2 min-h-[350px]"
                    >

                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-2 px-1">

                        <div className="flex items-center gap-1.5">

                          <h2 className="text-[10px] font-semibold text-[#111111]">
                            {column.title}
                          </h2>

                          <span className="text-[8px] text-[#999999]">
                            {columnTasks.length}
                          </span>

                        </div>

                        <div className="flex items-center gap-1">

                          <button
                            type="button"
                            className="text-[#888888] hover:text-[#222222]"
                          >
                            <Plus size={11} />
                          </button>

                          <button
                            type="button"
                            className="text-[#888888] text-[9px]"
                          >
                            •••
                          </button>

                        </div>

                      </div>

                      {/* Cards */}
                      <div className="space-y-1.5">

                        {columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                          />
                        ))}

                      </div>

                      {/* Add Task */}
                      <button
                        type="button"
                        className="w-full text-left text-[8px] text-[#555555] mt-2 px-1 hover:text-black"
                      >
                        + Add Task
                      </button>

                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* ================= LIST ================= */}
          {view === "list" && (
            <div className="p-7">

              {columns.map((column) => {
                const columnTasks = filteredTasks.filter(
                  (task) => task.status === column.status
                );

                return (
                  <section
                    key={column.status}
                    className="mb-7"
                  >

                    <div className="flex items-center gap-2 mb-2">

                      <h2 className="text-[11px] font-semibold text-gray-900">
                        {column.title}
                      </h2>

                      <span className="text-[10px] text-gray-400">
                        {columnTasks.length}
                      </span>

                    </div>

                    <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">

                      <div className="grid grid-cols-[1fr_130px_150px_130px_40px] bg-[#F8F8F8] border-b border-[#E5E5E5] px-4 py-2">

                        <span className="text-[10px] text-gray-500">
                          Task
                        </span>

                        <span className="text-[10px] text-gray-500">
                          Priority
                        </span>

                        <span className="text-[10px] text-gray-500">
                          Members
                        </span>

                        <span className="text-[10px] text-gray-500">
                          Due Date
                        </span>

                        <span />

                      </div>

                      {columnTasks.map((task) => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className="grid grid-cols-[1fr_130px_150px_130px_40px] items-center px-4 py-3 border-b last:border-b-0 border-[#E5E5E5] hover:bg-gray-50"
                        >

                          <span className="text-[11px] text-gray-800">
                            {task.title}
                          </span>

                          <span className="text-[11px] text-gray-600">
                            {task.priority}
                          </span>

                          <span className="flex items-center gap-2 text-[11px] text-gray-600">
                            <span className="w-5 h-5 rounded-full bg-purple-500" />
                            {task.member}
                          </span>

                          <span className="flex items-center gap-1 text-[10px] text-gray-600">
                            <CalendarDays size={12} />
                            {task.dueDate}
                          </span>

                          <span className="text-gray-400">
                            •••
                          </span>

                        </Link>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="px-4 py-5 text-[11px] text-gray-400">
                          No tasks found.
                        </div>
                      )}

                    </div>
                  </section>
                );
              })}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}


/* ================= TASK CARD ================= */

function TaskCard({
  task,
}: {
  task: (typeof tasks)[number];
}) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block w-full bg-white border border-[#DCDCDC] rounded-md p-2.5 hover:border-gray-300 transition"
    >

      {/* Title */}
      <div className="flex items-start justify-between gap-1">

        <h3 className="text-[10px] font-medium text-[#111111] leading-[13px] truncate">
          {task.title}
        </h3>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="text-[#888888] text-[8px] shrink-0"
        >
          •••
        </button>

      </div>

      {/* Member + Date */}
      <div className="flex items-center justify-between mt-2">

        {/* Member */}
        <div className="flex items-center gap-1.5 min-w-0">

          <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
            <UserRound
              size={8}
              className="text-white"
            />
          </div>

          <span className="text-[8px] text-[#555555] truncate">
            {task.member}
          </span>

        </div>

        {/* Date */}
        <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-500 rounded-full px-1.5 py-0.5 text-[7px] shrink-0 ml-2">
          <CalendarDays size={8} />
          {task.dueDate}
        </span>

      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-1 mt-2">

        {task.labels.map((label) => (
          <span
            key={label}
            className="border border-[#E5E5E5] rounded-full px-1.5 py-0.5 text-[7px] text-[#555555]"
          >
            {label}
          </span>
        ))}

      </div>

    </Link>
  );
}