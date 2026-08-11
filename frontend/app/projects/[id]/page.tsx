"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    CalendarDays,
    ChevronDown,
    LayoutGrid,
    List,
    PanelLeft,
} from "lucide-react";

type Project = {
    id: number;
    name: string;
    priority: "High" | "Medium" | "Low";
    lead: string;
    dueDate: string;
    members?: string;
};

const PROJECTS_KEY = "ablespace-projects";

const defaultProjects: Project[] = [
    {
        id: 1,
        name: "Design Homepage",
        priority: "High",
        lead: "Admin",
        dueDate: "12 Sep 2026",
        members: "Admin",
    },
    {
        id: 2,
        name: "Develop Login Feature",
        priority: "Low",
        lead: "CN",
        dueDate: "15 Sep 2026",
        members: "CN",
    },
    {
        id: 3,
        name: "Test Payment Gateway",
        priority: "Medium",
        lead: "+",
        dueDate: "18 Sep 2026",
        members: "+",
    },
];

export default function ProjectDetailPage() {
    const params = useParams();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = () => {
            const savedProjects =
                localStorage.getItem(PROJECTS_KEY);

            if (savedProjects) {
                try {
                    const parsedProjects: Project[] =
                        JSON.parse(savedProjects);

                    setProjects(parsedProjects);
                } catch {
                    setProjects(defaultProjects);
                }
            } else {
                setProjects(defaultProjects);

                localStorage.setItem(
                    PROJECTS_KEY,
                    JSON.stringify(defaultProjects)
                );
            }

            setLoading(false);
        };

        loadProjects();

        const handleProjectsUpdated = () => {
            loadProjects();
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === PROJECTS_KEY) {
                loadProjects();
            }
        };

        window.addEventListener(
            "ablespace-projects-updated",
            handleProjectsUpdated
        );

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "ablespace-projects-updated",
                handleProjectsUpdated
            );

            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <span className="text-[11px] text-gray-500">
                    Loading...
                </span>
            </div>
        );
    }

    const projectId = Number(params.id);

    const project = projects.find(
        (item) => item.id === projectId
    );

    if (!project) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[12px] font-medium mb-3">
                        Project not found
                    </p>

                    <Link
                        href="/projects"
                        className="text-[10px] text-blue-600 hover:underline"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="flex min-h-screen">

                {/* SIDEBAR */}
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
                            className="text-[#555555]"
                        />

                    </div>

                    {/* Workspace */}
                    <div className="px-3 pt-4">

                        <div className="flex items-center justify-between px-1 mb-2">

                            <p className="text-[9px] font-medium text-[#777777]">
                                Workspace
                            </p>

                            <ChevronDown size={10} />

                        </div>

                        <nav className="space-y-1">

                            <Link
                                href="/tasks"
                                className="flex h-[31px] items-center gap-2 rounded-md px-2 text-[10px] font-medium text-[#333333] hover:bg-[#F5F5F5]"
                            >
                                <List size={12} />
                                <span>Tasks</span>
                            </Link>

                            <Link
                                href="/projects"
                                className="flex h-[31px] items-center gap-2 rounded-md bg-[#F2F2F2] px-2 text-[10px] font-medium text-[#111111]"
                            >
                                <LayoutGrid size={12} />
                                <span>Projects</span>
                            </Link>

                        </nav>

                    </div>

                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 min-w-0">

                    {/* TOP BAR + BREADCRUMB */}
<div className="h-[40px] border-b border-[#E5E5E5] flex items-center px-4">

    <button
        type="button"
        className="w-6 h-6 flex items-center justify-center shrink-0"
    >
        <PanelLeft
            size={13}
            strokeWidth={1.5}
        />
    </button>

    <div className="ml-3 flex items-center gap-2">

        <Link
            href="/projects"
            className="text-[9px] text-[#777777] hover:text-[#111111]"
        >
            Projects
        </Link>

        <span className="text-[9px] text-[#AAAAAA]">
            ›
        </span>

        <span className="text-[9px] text-[#333333]">
            {project.name}
        </span>

    </div>

</div>

                    {/* PROJECT DETAILS */}
                    <section className="px-5 py-5">
                        <div className="border border-[#E5E5E5] rounded-md bg-white">

                            <div className="px-4 py-3 border-b border-[#E5E5E5]">
                                <h1 className="text-[14px] font-semibold text-[#111111]">
                                    {project.name}
                                </h1>

                                <p className="mt-1 text-[9px] text-[#777777]">
                                    Project details
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-0 px-4">

                                {/* Priority */}
                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">
                                        Priority
                                    </p>

                                    <p
                                        className={`mt-1 text-[10px] font-medium ${
                                            project.priority === "High"
                                                ? "text-red-500"
                                                : project.priority === "Medium"
                                                ? "text-orange-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {project.priority}
                                    </p>
                                </div>

                                {/* Lead */}
                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">
                                        Lead
                                    </p>

                                    <p className="mt-1 text-[10px] font-medium text-[#222222]">
                                        {project.lead}
                                    </p>
                                </div>

                                {/* Due Date */}
                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">
                                        Due Date
                                    </p>

                                    <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#222222]">
                                        <CalendarDays
                                            size={10}
                                            className="text-[#777777]"
                                        />

                                        {project.dueDate}
                                    </p>
                                </div>

                                {/* Members */}
                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">
                                        Members
                                    </p>

                                    <p className="mt-1 text-[10px] font-medium text-[#222222]">
                                        {project.members || project.lead || "Not assigned"}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </section>

                </main>

            </div>
        </div>
    );
}
