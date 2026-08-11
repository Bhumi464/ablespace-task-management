"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    ChevronDown,
    Filter,
    LayoutGrid,
    List,
    PanelLeft,
    Plus,
    Search,
    UserRound,
    X,
    Sun,
    Moon,
    Settings,
} from "lucide-react";

type Project = {
    id: number;
    name: string;
    priority: "High" | "Medium" | "Low";
    lead: string;
    dueDate: string;
};

const initialProjects: Project[] = [
    {
        id: 1,
        name: "Design Homepage",
        priority: "High",
        lead: "Admin",
        dueDate: "12 Sep 2026",
    },
    {
        id: 2,
        name: "Develop Login Feature",
        priority: "Low",
        lead: "CN",
        dueDate: "15 Sep 2026",
    },
    {
        id: 3,
        name: "Test Payment Gateway",
        priority: "Medium",
        lead: "+",
        dueDate: "18 Sep 2026",
    },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const [showFilter, setShowFilter] = useState(false);

    const [priorityFilter, setPriorityFilter] = useState("All");

    const [showAddProject, setShowAddProject] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

    const [newProject, setNewProject] = useState({
        name: "",
        priority: "High" as Project["priority"],
        lead: "Admin",
        dueDate: "",
    });

    const [profileOpen, setProfileOpen] = useState(false);
const [themeOpen, setThemeOpen] = useState(false);
const [theme, setTheme] = useState<"Light" | "Dark">("Light");
useEffect(() => {
    const savedTheme = localStorage.getItem("ablespace-theme");

    if (savedTheme === "Dark") {
        setTheme("Dark");
        document.documentElement.classList.add("dark");
    }
}, []);

    const filterRef = useRef<HTMLDivElement>(null);
const profileRef = useRef<HTMLDivElement>(null);

const changeTheme = (newTheme: "Light" | "Dark") => {
    setTheme(newTheme);

    localStorage.setItem("ablespace-theme", newTheme);

    if (newTheme === "Dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    setThemeOpen(false);
};
    /* --------------------------------
       Close dropdowns when clicking outside
    -------------------------------- */

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        // Close filter when clicking outside
        if (
            filterRef.current &&
            !filterRef.current.contains(target)
        ) {
            setShowFilter(false);
        }

        // Close Dexter menu when clicking outside
        if (
            profileRef.current &&
            !profileRef.current.contains(target)
        ) {
            setProfileOpen(false);
            setThemeOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };
}, []);

    /* --------------------------------
       Search + filter
    -------------------------------- */

    const filteredProjects = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return projects.filter((project) => {
            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(searchText) ||
                project.lead
                    .toLowerCase()
                    .includes(searchText);

            const matchesPriority =
                priorityFilter === "All" ||
                project.priority === priorityFilter;

            return matchesSearch && matchesPriority;
        });
    }, [projects, search, priorityFilter]);

    /* --------------------------------
       Add project
    -------------------------------- */

    const saveProject = () => {
        if (!newProject.name.trim()) {
            return;
        }

        if (editingProjectId !== null) {
            setProjects((current) =>
                current.map((project) =>
                    project.id === editingProjectId
                        ? {
                            ...project,
                            name: newProject.name.trim(),
                            priority: newProject.priority,
                            lead: newProject.lead,
                            dueDate:
                                newProject.dueDate || project.dueDate,
                        }
                        : project
                )
            );
        } else {
            const project: Project = {
                id: Date.now(),
                name: newProject.name.trim(),
                priority: newProject.priority,
                lead: newProject.lead,
                dueDate:
                    newProject.dueDate || "18 Sep 2026",
            };

            setProjects((current) => [
                ...current,
                project,
            ]);
        }

        setNewProject({
            name: "",
            priority: "High",
            lead: "Admin",
            dueDate: "",
        });

        setEditingProjectId(null);
        setShowAddProject(false);
    };

    const handleEditProject = (project: Project) => {
        setNewProject({
            name: project.name,
            priority: project.priority,
            lead: project.lead,
            dueDate: project.dueDate,
        });
        setEditingProjectId(project.id);
        setShowAddProject(true);
    };

    const handleDeleteProject = (projectId: number) => {
        setProjects((current) =>
            current.filter((project) => project.id !== projectId)
        );
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="flex min-h-screen">

                {/* =====================================================
            SIDEBAR
        ====================================================== */}

                <aside className="w-[155px] shrink-0 border-r border-[#E5E5E5] bg-white">

                    {/* Dexter Profile */}
<div
    ref={profileRef}
    className="relative h-[55px] px-4 flex items-center border-b border-[#E5E5E5]"
>
    <button
        type="button"
        onClick={(event) => {
            event.stopPropagation();

            setProfileOpen((prev) => !prev);
            setThemeOpen(false);
        }}
        className="
            w-full
            flex
            items-center
            justify-between
            rounded-md
            px-1
            py-1
            cursor-pointer
            hover:bg-[#F5F5F5]
        "
    >
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
    </button>

    {profileOpen && (
        <div
            className="
                absolute
                left-[6px]
                top-[50px]
                z-[9999]
                w-[144px]
                rounded-md
                border
                border-[#E5E5E5]
                bg-white
                shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            "
        >
            {/* Profile */}
            <div className="px-3 py-3">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-[12px] font-medium text-white">
                            D
                        </span>
                    </div>

                    <p className="text-[10px] font-medium text-[#111111] mt-1">
                        Dexter
                    </p>

                    <p className="text-[8px] text-[#777777]">
                        Dexter@gmail.com
                    </p>
                </div>
            </div>

            <div className="border-t border-[#EEEEEE]" />

            {/* Change Theme */}
            <div className="relative">
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        setThemeOpen((prev) => !prev);
                    }}
                    className="
                        w-full
                        h-[32px]
                        px-3
                        flex
                        items-center
                        justify-between
                        text-[9px]
                        text-[#333333]
                        hover:bg-[#F5F5F5]
                        cursor-pointer
                    "
                >
                    <span className="flex items-center gap-2">
                        <Sun size={11} />
                        Change Theme
                    </span>

                    <span>›</span>
                </button>

                {/* Theme submenu */}
                {themeOpen && (
                    <div
                        className="
                            absolute
                            left-[140px]
                            top-0
                            z-[10000]
                            w-[105px]
                            rounded-md
                            border
                            border-[#E5E5E5]
                            bg-white
                            shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                            py-1
                        "
                    >
                        <p className="px-3 py-1 text-[8px] text-[#777777]">
                            Theme
                        </p>

                        <button
    type="button"
    onClick={() => changeTheme("Light")}
    className="
        w-full
        px-3
        py-1.5
        flex
        items-center
        justify-between
        text-[9px]
        text-[#333333]
        hover:bg-[#F5F5F5]
        cursor-pointer
    "
>
    <span className="flex items-center gap-2">
        <Sun size={10} />
        Light
    </span>

    {theme === "Light" && (
        <span>✓</span>
    )}
</button>

                        <button
    type="button"
    onClick={() => changeTheme("Dark")}
    className="
        w-full
        px-3
        py-1.5
        flex
        items-center
        justify-between
        text-[9px]
        text-[#333333]
        hover:bg-[#F5F5F5]
        cursor-pointer
    "
>
    <span className="flex items-center gap-2">
        <Moon size={10} />
        Dark
    </span>

    {theme === "Dark" && (
        <span>✓</span>
    )}
</button>
                    </div>
                )}
            </div>

            {/* Color Mode */}
            <button
                type="button"
                className="
                    w-full
                    h-[32px]
                    px-3
                    flex
                    items-center
                    justify-between
                    text-[9px]
                    text-[#333333]
                    hover:bg-[#F5F5F5]
                    cursor-pointer
                "
            >
                <span>
                    ■&nbsp;&nbsp;Color Mode
                </span>

                <span>›</span>
            </button>

            {/* Settings */}
            <button
                type="button"
                onClick={() => {
                    window.location.href = "/settings";
                }}
                className="
                    w-full
                    h-[32px]
                    px-3
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    text-[#333333]
                    hover:bg-[#F5F5F5]
                    cursor-pointer
                "
            >
                <Settings size={11} />
                Settings
            </button>
        </div>
    )}
</div>

                    {/* Workspace */}

                    <div className="px-3 pt-4">

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
                                className="flex h-[31px] items-center gap-2 rounded-md px-2 text-[10px] font-medium text-[#333333] hover:bg-[#F7F7F7]"
                            >
                                <List
                                    size={12}
                                    strokeWidth={1.6}
                                    className="text-[#555555]"
                                />

                                <span>
                                    Tasks
                                </span>
                            </Link>

                            {/* Projects */}

                            <Link
                                href="/projects"
                                className="flex h-[31px] items-center gap-2 rounded-md bg-[#F2F2F2] px-2 text-[10px] font-medium text-[#111111]"
                            >
                                <LayoutGrid
                                    size={12}
                                    strokeWidth={1.5}
                                    className="text-[#222222]"
                                />

                                <span >
                                    Projects
                                </span>
                            </Link>

                        </nav>
                    </div>

                </aside>

                {/* =====================================================
            MAIN
        ====================================================== */}

                <main className="flex-1 min-w-0">

                    {/* =================================================
              TOP BAR
          ================================================= */}

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

                    {/* =================================================
              PROJECTS HEADER
          ================================================= */}

                    <header className="h-[52px] border-b border-[#E5E5E5] flex items-center justify-between px-5 bg-white">

                        {/* Title */}

                        <h1 className="text-[14px] font-semibold text-[#111111]">
                            Projects
                        </h1>

                        {/* Controls */}

                        <div className="flex items-center gap-1.5 relative">

                            {/* Search */}

                            {showSearch ? (
                                <div className="h-7 flex items-center gap-2 border border-[#E5E5E5] rounded-md px-2 bg-white">

                                    <Search
                                        size={12}
                                        className="text-gray-400"
                                    />

                                    <input
                                        autoFocus
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search"
                                        className="w-[150px] text-[9px] outline-none text-gray-900"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setShowSearch(false);
                                        }}
                                    >
                                        <X
                                            size={11}
                                            className="text-gray-400"
                                        />
                                    </button>

                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSearch(true)
                                    }
                                    className="
                    w-7 h-7
                    border border-[#E5E5E5]
                    rounded-md
                    flex items-center justify-center
                    text-[#444444]
                    bg-white
                    hover:bg-[#E8E8E8]
                  "
                                    title="Search"
                                >
                                    <Search
                                        size={13}
                                        strokeWidth={1.8}
                                    />
                                </button>
                            )}

                            {/* Filter */}

                            <div
                                ref={filterRef}
                                className="relative"
                            >
                                

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFilter(
                                            (previous) => !previous
                                        );
                                        setShowFilter(true);
                                    }}
                                    className="
                    w-7 h-7
                    border border-[#E5E5E5]
                    rounded-md
                    flex items-center justify-center
                    text-[#444444]
                    bg-white
                    hover:bg-[#E8E8E8]
                  "
                                    title="Filter"
                                >
                                    <Filter
                                        size={12}
                                        strokeWidth={1.8}
                                    />
                                </button>

                                {showFilter && (
                                    <div
                                        className="
                      absolute
                      right-0
                      top-[34px]
                      z-50
                      w-[170px]
                      rounded-md
                      border border-[#E5E5E5]
                      bg-white
                      shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                      p-2
                    "
                                    >

                                        <p className="px-2 py-1 text-[9px] font-medium text-gray-700">
                                            Priority
                                        </p>

                                        {[
                                            "All",
                                            "High",
                                            "Medium",
                                            "Low",
                                        ].map((priority) => (

                                            <button
                                                key={priority}
                                                type="button"
                                                onClick={() => {
                                                    setPriorityFilter(
                                                        priority
                                                    );
                                                    setShowFilter(false);
                                                }}
                                                className="
                          w-full
                          flex items-center justify-between
                          px-2 py-1.5
                          rounded
                          text-[9px]
                          hover:bg-gray-50
                        "
                                            >

                                                <span>
                                                    {priority}
                                                </span>

                                                {priorityFilter ===
                                                    priority && (
                                                        <span>
                                                            ✓
                                                        </span>
                                                    )}

                                            </button>

                                        ))}

                                    </div>
                                )}

                            </div>

                            {/* Add Project */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProject(true)
                                }
                                className="
                  h-7 px-3
                  rounded-md
                  bg-black
                  text-white
                  text-[10px]
                  font-medium
                  flex items-center gap-1.5
                  hover:bg-[#333333]
                "
                            >
                                <Plus size={12} />

                                <span>
                                    Add Project
                                </span>
                            </button>

                        </div>

                    </header>

                    {/* =================================================
              PROJECT TABLE
          ================================================= */}

                    <div className="w-full px-4 py-4">

                        <div className="w-full border border-[#E5E5E5] rounded-lg overflow-hidden bg-white">

                            {/* Table Header */}

                            <div
                                className="
  grid
  grid-cols-[minmax(250px,1fr)_110px_150px_130px_50px]
  items-center
  px-3
  py-2.5
  bg-[#F8F8F8]
  border-b border-[#E5E5E5]
"
                            >

                                <span className="text-[12px] font-bold text-[#555555]">
                                    Project
                                </span>

                                <span className="text-[12px] font-bold text-[#555555]">
                                    Priority
                                </span>

                                <span className="text-[12px] font-bold text-[#555555]">
                                    Lead
                                </span>

                                <span className="text-[12px] font-bold text-[#555555]">
                                    Due Date
                                </span>

                                <span className="text-[12px] font-bold text-[#555555] text-center">
                                    Actions
                                </span>

                            </div>

                            {/* Project Rows */}

                            {filteredProjects.map(
                                (project) => (

                                    <div
                                        key={project.id}
                                        className="
                      grid
                      grid-cols-[minmax(250px,1fr)_110px_150px_130px_50px]
                      items-center
                      min-h-[42px]
                      px-3
                      border-b border-[#E5E5E5]
                      hover:bg-[#FAFAFA]
                      transition-colors
                    "
                                    >

                                        {/* Project */}

                                        <span className="text-[10px] font-medium text-[#222222] truncate">
                                            {project.name}
                                        </span>

                                        {/* Priority */}

                                        <PriorityText
                                            priority={project.priority}
                                        />

                                        {/* Lead */}

                                        <div className="flex items-center gap-2">

                                            <div className="
                          w-5 h-5
                          rounded-full
                          bg-purple-500
                          flex items-center justify-center
                        ">
                                                <UserRound
                                                    size={9}
                                                    className="text-white"
                                                />
                                            </div>

                                            <span className="text-[9px]">
                                                {project.lead}
                                            </span>

                                        </div>

                                        {/* Due Date */}

                                        <span className="flex items-center gap-1 text-[9px]">

                                            <CalendarDays
                                                size={10}
                                                className="text-gray-500"
                                            />

                                            {project.dueDate}

                                        </span>

                                        {/* Actions */}

                                        <ProjectActions
                                            project={project}
                                            onEdit={handleEditProject}
                                            onDelete={handleDeleteProject}
                                        />

                                    </div>

                                )
                            )}

                            {/* Empty state */}

                            {filteredProjects.length === 0 && (
                                <div className="px-3 py-8 text-center">

                                    <p className="text-[9px] text-gray-400">
                                        No projects found
                                    </p>

                                </div>
                            )}

                            {/* Add Project */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProject(true)
                                }
                                className="
                  w-full
                  text-left
                  px-3
                  py-2.5
                  text-[11px]
                  text-gray-500
                  hover:bg-gray-50
                "
                            >
                                + Add Project
                            </button>

                        </div>

                    </div>

                </main>

            </div>

            {/* =====================================================
          ADD PROJECT MODAL
      ====================================================== */}

            {showAddProject && (

                <div
                    className="
            fixed
            inset-0
            z-[100]
            bg-black/20
            flex
            items-center
            justify-center
          "
                >

                    <div
                        className="
              w-[360px]
              rounded-lg
              bg-white
              border border-gray-200
              shadow-xl
              p-5
            "
                    >

                        {/* Modal Header */}

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-sm font-semibold text-gray-900">
                                {editingProjectId !== null
                                    ? "Edit Project"
                                    : "Add Project"}
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProject(false)
                                }
                            >
                                <X
                                    size={15}
                                    className="text-gray-400"
                                />
                            </button>

                        </div>

                        {/* Form */}

                        <div className="space-y-4">

                            {/* Name */}

                            <div>

                                <label className="block text-[9px] text-gray-500 mb-1.5">
                                    Project Name
                                </label>

                                <input
                                    value={newProject.name}
                                    onChange={(event) =>
                                        setNewProject(
                                            (current) => ({
                                                ...current,
                                                name: event.target.value,
                                            })
                                        )
                                    }
                                    placeholder="Enter project name"
                                    className="
                    w-full
                    h-9
                    border border-gray-200
                    rounded-md
                    px-3
                    text-[10px]
                    outline-none
                    focus:border-gray-400
                  "
                                />

                            </div>

                            {/* Priority */}

                            <div>

                                <label className="block text-[9px] text-gray-500 mb-1.5">
                                    Priority
                                </label>

                                <select
                                    value={newProject.priority}
                                    onChange={(event) =>
                                        setNewProject(
                                            (current) => ({
                                                ...current,
                                                priority:
                                                    event.target.value as Project["priority"],
                                            })
                                        )
                                    }
                                    className="
                    w-full
                    h-9
                    border border-gray-200
                    rounded-md
                    px-3
                    text-[10px]
                    outline-none
                  "
                                >
                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>
                                </select>

                            </div>

                            {/* Lead */}

                            <div>

                                <label className="block text-[9px] text-gray-500 mb-1.5">
                                    Lead
                                </label>

                                <select
                                    value={newProject.lead}
                                    onChange={(event) =>
                                        setNewProject(
                                            (current) => ({
                                                ...current,
                                                lead: event.target.value,
                                            })
                                        )
                                    }
                                    className="
                    w-full
                    h-9
                    border border-gray-200
                    rounded-md
                    px-3
                    text-[10px]
                    outline-none
                  "
                                >
                                    <option>
                                        Admin
                                    </option>

                                    <option>
                                        Designer
                                    </option>

                                    <option>
                                        Developer
                                    </option>

                                    <option>
                                        QA Team
                                    </option>

                                    <option>
                                        CN
                                    </option>
                                </select>

                            </div>

                            {/* Due Date */}

                            <div>

                                <label className="block text-[9px] text-gray-500 mb-1.5">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={newProject.dueDate}
                                    onChange={(event) =>
                                        setNewProject(
                                            (current) => ({
                                                ...current,
                                                dueDate:
                                                    event.target.value,
                                            })
                                        )
                                    }
                                    className="
                    w-full
                    h-9
                    border border-gray-200
                    rounded-md
                    px-3
                    text-[10px]
                    outline-none
                  "
                                />

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="flex justify-end gap-2 mt-6">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProject(false)
                                }
                                className="
                  h-8
                  px-3
                  border border-gray-200
                  rounded-md
                  text-[9px]
                  hover:bg-gray-50
                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={saveProject}
                                className="
                  h-8
                  px-3
                  bg-black
                  text-white
                  rounded-md
                  text-[9px]
                  hover:bg-gray-800
                "
                            >
                                {editingProjectId !== null
                                    ? "Save Changes"
                                    : "Add Project"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

/* =========================================================
   PROJECT ACTIONS
========================================================= */

function ProjectActions({
    project,
    onEdit,
    onDelete,
}: {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (projectId: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [open]);

    return (
        <div
            ref={menuRef}
            className="relative flex justify-center"
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen((previous) => !previous);
                }}
                className="text-[10px] text-[#888888] hover:text-[#222222] px-2"
                aria-label="Project actions"
            >
                •••
            </button>

            {open && (
                <div
                    className="
            absolute
            right-0
            top-6
            z-50
            w-[110px]
            rounded-md
            border border-[#E5E5E5]
            bg-white
            shadow-[0_4px_12px_rgba(0,0,0,0.12)]
            py-1
          "
                >
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit(project);
                        }}
                        className="
              w-full
              px-3
              py-2
              text-left
              text-[9px]
              text-[#333333]
              hover:bg-[#F7F7F7]
            "
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete(project.id);
                        }}
                        className="
              w-full
              px-3
              py-2
              text-left
              text-[9px]
              text-red-500
              hover:bg-red-50
            "
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   PRIORITY
========================================================= */

function PriorityText({
    priority,
}: {
    priority: Project["priority"];
}) {
    const styles = {
        High: "text-red-500",
        Medium: "text-orange-500",
        Low: "text-gray-400",
    };

    return (
        <span
            className={`text-[9px] ${styles[priority]}`}
        >
            ⋰ {priority}
        </span>
    );
}