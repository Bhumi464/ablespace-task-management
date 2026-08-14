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
    description: string;
    priority: "High" | "Medium" | "Low";
    lead: string;
    dueDate: string;
    members: string[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const defaultProjects: Project[] = [
  {
    id: 1,
    name: "Design Homepage",
    description: "",
    priority: "High",
    lead: "Admin",
    dueDate: "12 Sep 2026",
    members: ["Admin"],
  },
  {
    id: 2,
    name: "Develop Login Feature",
    description: "",
    priority: "Low",
    lead: "CN",
    dueDate: "15 Sep 2026",
    members: ["CN"],
  },
  {
    id: 3,
    name: "Test Payment Gateway",
    description: "",
    priority: "Medium",
    lead: "+",
    dueDate: "18 Sep 2026",
    members: ["+"],
  },
];

export default function ProjectDetailPage() {
    const params = useParams();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const projectId = Number(params.id);

    useEffect(() => {
        if (!Number.isFinite(projectId)) {
            setLoading(false);
            return;
        }

        const loadProject = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/projects/${projectId}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Project not found");
                }

                const data: Project = await response.json();
                setProject(data);
            } catch (error) {
                console.error("Failed to load project:", error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        loadProject();

        const handleProjectsUpdated = () => {
            loadProject();
        };

        window.addEventListener(
            "ablespace-projects-updated",
            handleProjectsUpdated
        );

        return () => {
            window.removeEventListener(
                "ablespace-projects-updated",
                handleProjectsUpdated
            );
        };
    }, [projectId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <span className="text-[11px] text-gray-500">
                    Loading...
                </span>
            </div>
        );
    }

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
                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">Priority</p>
                                    <select
                                        value={project.priority}
                                        onChange={(event) =>
                                            setProject({
                                                ...project,
                                                priority: event.target.value as Project["priority"],
                                            })
                                        }
                                        className="mt-1 w-full h-8 border border-[#E5E5E5] rounded-md px-2 text-[10px] outline-none"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">Lead</p>
                                    <select
                                        value={project.lead}
                                        onChange={(event) =>
                                            setProject({
                                                ...project,
                                                lead: event.target.value,
                                            })
                                        }
                                        className="mt-1 w-full h-8 border border-[#E5E5E5] rounded-md px-2 text-[10px] outline-none"
                                    >
                                        <option>Admin</option>
                                        <option>Designer</option>
                                        <option>Developer</option>
                                        <option>QA Team</option>
                                        <option>CN</option>
                                    </select>
                                </div>

                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">Due Date</p>
                                    <input
                                        type="date"
                                        value={
                                            /^\d{4}-\d{2}-\d{2}$/.test(project.dueDate)
                                                ? project.dueDate
                                                : ""
                                        }
                                        onChange={(event) =>
                                            setProject({
                                                ...project,
                                                dueDate: event.target.value,
                                            })
                                        }
                                        className="mt-1 w-full h-8 border border-[#E5E5E5] rounded-md px-2 text-[10px] outline-none"
                                    />
                                </div>

                                <div className="py-3 border-b border-[#E5E5E5]">
                                    <p className="text-[9px] text-[#777777]">Members</p>
                                    <p className="mt-1 text-[10px] font-medium text-[#222222]">
                                        {project.members?.join(", ") || project.lead || "Not assigned"}
                                    </p>
                                </div>

                                <div className="col-span-2 py-3">
                                    <p className="text-[9px] text-[#777777]">Description</p>
                                    <p className="mt-1 text-[10px] text-[#333333]">
                                        {project.description || "No description"}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-3 border-t border-[#E5E5E5] flex justify-end">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={async () => {
                                        try {
                                            setSaving(true);

                                            const response = await fetch(
                                                `${API_URL}/projects/${project.id}`,
                                                {
                                                    method: "PATCH",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        name: project.name,
                                                        description: project.description,
                                                        priority: project.priority,
                                                        lead: project.lead,
                                                        dueDate: project.dueDate,
                                                        members: project.members,
                                                    }),
                                                }
                                            );

                                            if (!response.ok) {
                                                throw new Error("Failed to save project");
                                            }

                                            const updated = await response.json();
                                            setProject(updated);

                                            window.dispatchEvent(
                                                new Event("ablespace-projects-updated")
                                            );
                                        } catch (error) {
                                            console.error(error);
                                            alert("Failed to save project");
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    className="h-8 px-3 bg-black text-white rounded-md text-[9px] hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </section>

                </main>

            </div>
        </div>
    );
}
