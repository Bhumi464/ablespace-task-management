"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    ChevronDown,
    Filter,
    Plus,
    Search,
    SlidersHorizontal,
    UserRound,
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
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
                    {/* User */}
                    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500" />

                            <span className="text-sm font-medium text-gray-900">
                                Dexter
                            </span>
                        </div>

                        <ChevronDown size={14} className="text-gray-500" />
                    </div>

                    {/* Navigation */}
                    <div className="px-4 py-5">
                        <p className="text-[11px] text-gray-400 mb-3 px-2">
                            Workspace
                        </p>

                        <Link
                            href="/tasks"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-gray-100 text-sm text-gray-900"
                        >
                            <span className="text-sm">☷</span>
                            Tasks
                        </Link>

                        <Link
                            href="/projects"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 mt-1"
                        >
                            <span className="text-sm">▣</span>
                            Projects
                        </Link>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-7">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Tasks
                        </h1>

                        <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md hover:bg-gray-800">
                            <Plus size={14} />
                            Add Task
                        </button>
                    </header>

                    {/* Toolbar */}
                    <div className="px-7 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-64 h-8 border border-gray-200 rounded-md pl-9 pr-3 text-xs outline-none focus:border-gray-400"
                                    />
                                </div>

                                {/* Fields */}
                                <button className="h-8 px-3 border border-gray-200 rounded-md text-xs text-gray-500 flex items-center gap-2 hover:bg-gray-50">
                                    Fields
                                </button>

                                {/* Filter */}
                                <button className="h-8 px-3 border border-gray-200 rounded-md text-xs text-gray-500 flex items-center gap-2 hover:bg-gray-50">
                                    <Filter size={13} />
                                    Filter
                                </button>

                                {/* Sort */}
                                <button className="h-8 px-3 border border-gray-200 rounded-md text-xs text-gray-500 flex items-center gap-2 hover:bg-gray-50">
                                    <SlidersHorizontal size={13} />
                                </button>
                            </div>

                            {/* View switch */}
                            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                                <button
                                    onClick={() => setView("list")}
                                    className={`px-4 h-8 text-xs ${view === "list"
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-500"
                                        }`}
                                >
                                    ☷ List
                                </button>

                                <button
                                    onClick={() => setView("board")}
                                    className={`px-4 h-8 text-xs ${view === "board"
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-500"
                                        }`}
                                >
                                    ▦ Board
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Board */}
                    {view === "board" && (
                        <div className="p-7 overflow-x-auto">
                            <div className="grid grid-cols-4 gap-4 min-w-[1050px]">
                                {columns.map((column) => {
                                    const columnTasks = filteredTasks.filter(
                                        (task) => task.status === column.status
                                    );

                                    return (
                                        <div
                                            key={column.status}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[500px]"
                                        >
                                            {/* Column header */}
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xs font-semibold text-gray-800">
                                                        {column.title}
                                                    </h2>

                                                    <span className="text-[10px] text-gray-400">
                                                        {columnTasks.length}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button className="text-gray-400 hover:text-gray-700">
                                                        <Plus size={14} />
                                                    </button>

                                                    <button className="text-gray-400 hover:text-gray-700">
                                                        ...
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cards */}
                                            <div className="space-y-2">
                                                {columnTasks.map((task) => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                    />
                                                ))}
                                            </div>

                                            {/* Add task */}
                                            <button className="w-full text-left text-[11px] text-gray-500 mt-4 px-1 hover:text-gray-900">
                                                + Add Task
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* List */}
                    {view === "list" && (
                        <div className="p-7">
                            {columns.map((column) => {
                                const columnTasks = filteredTasks.filter(
                                    (task) => task.status === column.status
                                );

                                return (
                                    <section key={column.status} className="mb-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xs font-semibold text-gray-900">
                                                {column.title}
                                            </h2>

                                            <span className="text-[10px] text-gray-400">
                                                {columnTasks.length}
                                            </span>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Table header */}
                                            <div className="grid grid-cols-[1fr_130px_150px_130px_40px] bg-gray-50 border-b border-gray-200 px-4 py-2">
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
                                                    className="grid grid-cols-[1fr_130px_150px_130px_40px] items-center px-4 py-3 border-b last:border-b-0 border-gray-200 hover:bg-gray-50"
                                                >
                                                    <span className="text-xs text-gray-800">
                                                        {task.title}
                                                    </span>

                                                    <span className="text-xs text-gray-600">
                                                        {task.priority}
                                                    </span>

                                                    <span className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className="w-5 h-5 rounded-full bg-purple-500" />
                                                        {task.member}
                                                    </span>

                                                    <span className="flex items-center gap-1 text-[10px] text-gray-600">
                                                        <CalendarDays size={12} />
                                                        {task.dueDate}
                                                    </span>

                                                    <span className="text-gray-400">
                                                        ...
                                                    </span>
                                                </Link>
                                            ))}

                                            {columnTasks.length === 0 && (
                                                <div className="px-4 py-5 text-xs text-gray-400">
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

/* Task Card */
function TaskCard({ task }: { task: (typeof tasks)[number] }) {
    return (
        <Link
            href={`/tasks/${task.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-gray-300 transition"
        >
            {/* Task title */}
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-medium text-gray-900 leading-5">
                    {task.title}
                </h3>

                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-gray-400 text-sm"
                >
                    ...
                </button>
            </div>

            {/* Member */}
            <div className="flex items-center gap-2 mt-3">
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                    <UserRound size={10} className="text-white" />
                </div>

                <span className="text-[10px] text-gray-500">
                    {task.member}
                </span>
            </div>

            {/* Date */}
            <div className="mt-3">
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 rounded-full px-2 py-1 text-[9px]">
                    <CalendarDays size={10} />
                    {task.dueDate}
                </span>
            </div>

            {/* Labels */}
            <div className="flex flex-wrap gap-1 mt-3">
                {task.labels.map((label) => (
                    <span
                        key={label}
                        className="border border-gray-200 rounded-full px-2 py-1 text-[9px] text-gray-500"
                    >
                        {label}
                    </span>
                ))}
            </div>
        </Link>
    );
}