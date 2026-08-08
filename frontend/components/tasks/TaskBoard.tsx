"use client";

import { useState } from "react";

import {
    Search,
    SlidersHorizontal,
    Plus,
    MoreHorizontal,
    CalendarDays,
    List,
    LayoutGrid,
} from "lucide-react";

type Task = {
    title: string;
    member: string;
    dueDate: string;
    priority: string;
};

type Column = {
    title: string;
    tasks: Task[];
};

const columns: Column[] = [
    {
        title: "To Do",
        tasks: [
            {
                title: "Write API Documentation",
                member: "Admin",
                dueDate: "29 Jul",
                priority: "High",
            },
            {
                title: "Implement Search Function",
                member: "Admin",
                dueDate: "29 Jul",
                priority: "Medium",
            },
            {
                title: "Deploy to Production",
                member: "Admin",
                dueDate: "28 Jul",
                priority: "High",
            },
        ],
    },
    {
        title: "Doing",
        tasks: [
            {
                title: "Code Review Completed",
                member: "Admin",
                dueDate: "29 Jul",
                priority: "High",
            },
            {
                title: "Design Mockups Finalized",
                member: "Admin",
                dueDate: "29 Jul",
                priority: "Medium",
            },
        ],
    },
    {
        title: "Completed",
        tasks: [
            {
                title: "Feature Testing Passed",
                member: "QA Team",
                dueDate: "30 Jul",
                priority: "Low",
            },
            {
                title: "UI Design Updated",
                member: "Designer",
                dueDate: "31 Jul",
                priority: "Medium",
            },
            {
                title: "Security Audit Scheduled",
                member: "Security",
                dueDate: "01 Aug",
                priority: "High",
            },
        ],
    },
    {
        title: "On Hold",
        tasks: [
            {
                title: "UI Review",
                member: "Designer",
                dueDate: "02 Aug",
                priority: "Low",
            },
            {
                title: "Backend Improvements",
                member: "Developer",
                dueDate: "03 Aug",
                priority: "Medium",
            },
        ],
    },
];

function TaskCard({ task }: { task: Task }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-gray-800">
                    {task.title}
                </p>

                <MoreHorizontal size={14} className="text-gray-400 shrink-0" />
            </div>

            <div className="mt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500" />

                <span className="text-[10px] text-gray-600">
                    {task.member}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[9px] text-red-500">
                    <CalendarDays size={10} />
                    {task.dueDate}
                </span>
            </div>

            <div className="mt-2 flex gap-1">
                <span className="rounded-full border border-gray-200 px-2 py-1 text-[9px] text-gray-500">
                    Deployment
                </span>

                <span className="rounded-full border border-gray-200 px-2 py-1 text-[9px] text-gray-500">
                    Development
                </span>
            </div>
        </div>
    );
}

export default function TaskBoard() {
    const [view, setView] = useState<"board" | "list">("board");

    return (
        <div className="flex-1 min-w-0 bg-white">
            {/* Header */}
            <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
                <h1 className="text-base font-semibold text-gray-900">
                    Tasks
                </h1>

                <button className="rounded-md bg-black px-3 py-1.5 text-[10px] text-white flex items-center gap-1">
                    <Plus size={12} />
                    Add Task
                </button>
            </header>

            {/* Toolbar */}
            <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 w-64">
                        <Search size={13} className="text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="outline-none text-xs w-full text-gray-700"
                        />
                    </div>

                    <button className="border border-gray-200 rounded-md px-3 py-1.5 text-xs">
                        Fields
                    </button>

                    <button className="border border-gray-200 rounded-md px-3 py-1.5">
                        <SlidersHorizontal size={13} />
                    </button>
                </div>

                {/* View switcher */}
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs ${view === "list"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500"
                            }`}
                    >
                        <List size={13} />
                        List
                    </button>

                    <button
                        onClick={() => setView("board")}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs ${view === "board"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500"
                            }`}
                    >
                        <LayoutGrid size={13} />
                        Board
                    </button>
                </div>
            </div>

            {/* Board */}
            {view === "board" && (
                <div className="p-5 overflow-x-auto">
                    <div className="flex gap-3 min-w-[900px]">
                        {columns.map((column) => (
                            <div
                                key={column.title}
                                className="w-[260px] shrink-0 rounded-lg bg-gray-50 border border-gray-200 p-2"
                            >
                                {/* Column header */}
                                <div className="flex items-center justify-between px-2 py-2">
                                    <span className="text-xs font-medium text-gray-700">
                                        {column.title}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <Plus size={13} className="text-gray-500" />
                                        <MoreHorizontal
                                            size={13}
                                            className="text-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-2">
                                    {column.tasks.map((task) => (
                                        <TaskCard
                                            key={task.title}
                                            task={task}
                                        />
                                    ))}
                                </div>

                                {/* Add task */}
                                <button className="mt-2 w-full text-left px-2 py-2 text-[10px] text-gray-500 hover:text-gray-800">
                                    + Add Task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            {view === "list" && (
                <div className="p-5">
                    {columns.map((column) => (
                        <div key={column.title} className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-gray-800">
                                    {column.title}
                                </span>

                                <span className="text-[10px] text-gray-400">
                                    {column.tasks.length}
                                </span>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] bg-gray-50 border-b border-gray-200 px-4 py-2">
                                    <span className="text-[10px] font-medium text-gray-500">
                                        Task
                                    </span>

                                    <span className="text-[10px] font-medium text-gray-500">
                                        Priority
                                    </span>

                                    <span className="text-[10px] font-medium text-gray-500">
                                        Members
                                    </span>

                                    <span className="text-[10px] font-medium text-gray-500">
                                        Due Date
                                    </span>

                                    <span />
                                </div>

                                {column.tasks.map((task) => (
                                    <div
                                        key={task.title}
                                        className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <span className="text-xs text-gray-800">
                                            {task.title}
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            {task.priority}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-purple-500" />

                                            <span className="text-[10px] text-gray-600">
                                                {task.member}
                                            </span>
                                        </div>

                                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <CalendarDays size={11} />
                                            {task.dueDate}
                                        </span>

                                        <MoreHorizontal
                                            size={14}
                                            className="text-gray-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}