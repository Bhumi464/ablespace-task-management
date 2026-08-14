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
    ChevronRight,
    Check,
} from "lucide-react";

type Project = {
    id: number;
    name: string;
    priority: "High" | "Medium" | "Low";
    lead: string;
    dueDate: string;
};
const THEME_KEY = "ablespace-theme";
const PROFILE_KEY = "ablespace-profile";

type Profile = {
    email: string;
    fullName: string;
    title: string;
    username: string;
};

const defaultProfile: Profile = {
    email: "Dexter@gmail.com",
    fullName: "Dexter",
    title: "Designer",
    username: "Dexuser",
};
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const PROJECTS_KEY = "ablespace-projects";
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const loadProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Failed to load projects");
            }

            const data: Project[] = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
            setProjects([]);
        } finally {
            setProjectsLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();

        const handleProjectsUpdated = () => {
            loadProjects();
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
    }, []);
    const [leadFilter, setLeadFilter] = useState("All");
    const [dueDateFilter, setDueDateFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [filterSubmenu, setFilterSubmenu] = useState<string | null>(null);

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
    const [colorModeOpen, setColorModeOpen] = useState(false);

    const [profile, setProfile] = useState<Profile>(defaultProfile);

    useEffect(() => {
        const loadProfile = () => {
            const savedProfile = localStorage.getItem(PROFILE_KEY);

            if (!savedProfile) {
                setProfile(defaultProfile);
                return;
            }

            try {
                setProfile({
                    ...defaultProfile,
                    ...JSON.parse(savedProfile),
                });
            } catch {
                setProfile(defaultProfile);
            }
        };

        loadProfile();

        window.addEventListener(
            "ablespace-profile-updated",
            loadProfile
        );

        window.addEventListener("storage", loadProfile);

        return () => {
            window.removeEventListener(
                "ablespace-profile-updated",
                loadProfile
            );

            window.removeEventListener("storage", loadProfile);
        };
    }, []);

    const [colorMode, setColorMode] = useState<
        "amber" | "blue" | "pink" | "rose" | "emerald" | "black" | "purple"
    >("purple");
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const applyTheme = (savedTheme: string | null) => {
            const nextTheme: "light" | "dark" =
                savedTheme === "dark" ? "dark" : "light";

            setTheme(nextTheme);

            if (nextTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        applyTheme(localStorage.getItem(THEME_KEY));

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === THEME_KEY) {
                applyTheme(event.newValue);
            }
        };

        const handleThemeUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<"light" | "dark">;
            applyTheme(customEvent.detail);
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("ablespace-theme-updated", handleThemeUpdated);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(
                "ablespace-theme-updated",
                handleThemeUpdated
            );
        };
    }, []);


    const changeTheme = (newTheme: "light" | "dark") => {
        setTheme(newTheme);

        localStorage.setItem(THEME_KEY, newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        window.dispatchEvent(
            new CustomEvent("ablespace-theme-updated", {
                detail: newTheme,
            })
        );

        setThemeOpen(false);
    };

    const changeColorMode = (
        newColor: "amber" | "blue" | "pink" | "rose" | "emerald" | "black" | "purple"
    ) => {
        setColorMode(newColor);

        localStorage.setItem("ablespace-color-mode", newColor);

        const colors = {
            amber: "#f59e0b",
            blue: "#3b82f6",
            pink: "#ec4899",
            rose: "#f43f5e",
            emerald: "#10b981",
            black: "#111111",
            purple: "#ac05fa",
        };

        document.documentElement.style.setProperty(
            "--accent-color",
            colors[newColor]
        );

        window.dispatchEvent(
            new CustomEvent("ablespace-color-mode-updated", {
                detail: newColor,
            })
        );

        setColorModeOpen(false);
    };

    useEffect(() => {
        const colors = {
            amber: "#f59e0b",
            blue: "#3b82f6",
            pink: "#ec4899",
            rose: "#f43f5e",
            emerald: "#10b981",
            black: "#111111",
            purple: "#ac05fa",
        };

        const applyColorMode = (savedColor: string | null) => {
            const selected =
                savedColor === "amber" ||
                    savedColor === "blue" ||
                    savedColor === "pink" ||
                    savedColor === "rose" ||
                    savedColor === "emerald" ||
                    savedColor === "black" ||
                    savedColor === "purple"
                    ? savedColor
                    : "purple";

            setColorMode(selected);

            document.documentElement.style.setProperty(
                "--accent-color",
                colors[selected]
            );
        };

        applyColorMode(localStorage.getItem("ablespace-color-mode"));

        const handleColorModeUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<
                "amber" | "blue" | "pink" | "rose" | "emerald" | "black" | "purple"
            >;

            applyColorMode(customEvent.detail);
        };

        window.addEventListener(
            "ablespace-color-mode-updated",
            handleColorModeUpdated
        );

        window.addEventListener("storage", (event) => {
            if (event.key === "ablespace-color-mode") {
                applyColorMode(event.newValue);
            }
        });

        return () => {
            window.removeEventListener(
                "ablespace-color-mode-updated",
                handleColorModeUpdated
            );
        };
    }, []);

    const filterRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

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
                setColorModeOpen(false);
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
                !searchText ||
                project.name
                    .toLowerCase()
                    .includes(searchText) ||
                project.lead
                    .toLowerCase()
                    .includes(searchText);

            const matchesPriority =
                priorityFilter === "All" ||
                project.priority === priorityFilter;

            const matchesLead =
                leadFilter === "All" ||
                project.lead === leadFilter;

            const matchesDueDate = (() => {
                if (dueDateFilter === "All") {
                    return true;
                }

                if (dueDateFilter === "No Due Date") {
                    return (
                        !project.dueDate ||
                        project.dueDate.trim() === ""
                    );
                }

                if (dueDateFilter === "Overdue") {
                    if (!project.dueDate) return false;

                    const projectDate = new Date(project.dueDate);
                    const today = new Date();

                    if (Number.isNaN(projectDate.getTime())) {
                        return false;
                    }

                    projectDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    return projectDate < today;
                }

                return project.dueDate === dueDateFilter;
            })();

            return (
                matchesSearch &&
                matchesPriority &&
                matchesLead &&
                matchesDueDate
            );
        });
    }, [
        projects,
        search,
        priorityFilter,
        leadFilter,
        dueDateFilter,
    ]);

    /* --------------------------------
       Add project
    -------------------------------- */

    const saveProject = async () => {
        if (!newProject.name.trim()) {
            return;
        }

        try {
            const payload = {
                name: newProject.name.trim(),
                description: "",
                priority: newProject.priority,
                lead: newProject.lead,
                dueDate: newProject.dueDate || "18 Sep 2026",
                members: [newProject.lead],
            };

            const url =
                editingProjectId !== null
                    ? `${API_URL}/projects/${editingProjectId}`
                    : `${API_URL}/projects`;

            const method =
                editingProjectId !== null ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message?.join?.(", ") ||
                    "Failed to save project"
                );
            }

            await loadProjects();

            window.dispatchEvent(
                new Event("ablespace-projects-updated")
            );

            setNewProject({
                name: "",
                priority: "High",
                lead: "Admin",
                dueDate: "",
            });

            setEditingProjectId(null);
            setShowAddProject(false);
        } catch (error) {
            console.error("Failed to save project:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to save project"
            );
        }
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

    const handleDeleteProject = async (projectId: number) => {
        try {
            const response = await fetch(
                `${API_URL}/projects/${projectId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            await loadProjects();

            window.dispatchEvent(
                new Event("ablespace-projects-updated")
            );
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert("Failed to delete project");
        }
    };


    if (projectsLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <span className="text-[11px] text-gray-500">
                    Loading...
                </span>
            </div>
        );
    }

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
                                setColorModeOpen(false);
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
                                <div className="w-[21px] h-[21px] rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                                    <span className="text-[8px] font-medium text-white">
                                        {profile.fullName.charAt(0).toUpperCase() || "D"}
                                    </span>
                                </div>

                                <span className="text-[11px] font-semibold text-[#111111]">
                                    {profile.fullName}
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
                                        <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                                            <span className="text-[12px] font-medium text-white">
                                                {profile.fullName.charAt(0).toUpperCase() || "D"}
                                            </span>
                                        </div>

                                        <p className="text-[10px] font-medium text-[#111111] mt-1">
                                            {profile.fullName}
                                        </p>

                                        <p className="text-[8px] text-[#777777]">
                                            {profile.email}
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
                                                onClick={() => changeTheme("light")}
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

                                                {theme === "light" && (
                                                    <span>✓</span>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => changeTheme("dark")}
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

                                                {theme === "dark" && (
                                                    <span>✓</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Color Mode */}
                                {/* Color Mode */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setColorModeOpen((prev) => !prev);
                                            setThemeOpen(false);
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
                                            <span
                                                className="w-[7px] h-[7px] rounded-[1px]"
                                                style={{ backgroundColor: "var(--accent-color)" }}
                                            />
                                            <span>Color Mode</span>
                                        </span>

                                        <span className="text-[10px]">›</span>
                                    </button>

                                    {/* Color Mode submenu */}
                                    {colorModeOpen && (
                                        <div
                                            className="
        absolute
        left-[140px]
        top-0
        z-[10000]
        w-[115px]
        rounded-md
        border
        border-[#E5E5E5]
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        py-1
      "
                                        >
                                            <p className="px-3 py-1 text-[8px] text-[#777777]">
                                                Color Mode
                                            </p>

                                            {[
                                                { key: "amber", label: "Amber", color: "#f59e0b" },
                                                { key: "blue", label: "Blue", color: "#3b82f6" },
                                                { key: "pink", label: "Pink", color: "#ec4899" },
                                                { key: "rose", label: "Rose", color: "#f43f5e" },
                                                { key: "emerald", label: "Emerald", color: "#10b981" },
                                                { key: "black", label: "Black", color: "#111111" },
                                                { key: "purple", label: "Purple", color: "#ac05fa" },
                                            ].map((item) => (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    onClick={() =>
                                                        changeColorMode(
                                                            item.key as
                                                            | "amber"
                                                            | "blue"
                                                            | "pink"
                                                            | "rose"
                                                            | "emerald"
                                                            | "black"
                                                            | "purple"
                                                        )
                                                    }
                                                    className="
            w-full
            h-[28px]
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
                                                        <span
                                                            className="w-[8px] h-[8px] rounded-[1px]"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        {item.label}
                                                    </span>

                                                    {colorMode === item.key && <span>✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        window.location.href = "/settings";
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-[10px] text-[#333333] hover:bg-[#F5F5F5]"
                                >
                                    <Settings
                                        size={12}
                                        strokeWidth={1.5}
                                        className="text-[#555555]"
                                    />

                                    <span>Settings</span>
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

                            {/* FILTER */}
                            <div ref={filterRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFilter((previous) => !previous);
                                        setFilterSubmenu(null);
                                    }}
                                    className="
      w-7 h-7
      border border-[#E5E5E5]
      rounded-md
      flex items-center justify-center
      bg-white
      hover:bg-[#F5F5F5]
    "
                                >
                                    <Filter size={12} strokeWidth={1.8} />
                                </button>

                                {showFilter && (
                                    <div
                                        className="
        absolute
        right-0
        top-[34px]
        z-50
        w-[120px]
        rounded-md
        border border-[#E5E5E5]
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        py-1
      "
                                    >

                                        {/* Priority */}
                                        <FilterMenuItem
                                            label="Priority"
                                            active={filterSubmenu === "priority"}
                                            onClick={() =>
                                                setFilterSubmenu(
                                                    filterSubmenu === "priority"
                                                        ? null
                                                        : "priority"
                                                )
                                            }
                                        />

                                        {filterSubmenu === "priority" && (
                                            <FilterSubmenu
                                                title="Priority"
                                                value={priorityFilter}
                                                options={[
                                                    "All",
                                                    "Urgent",
                                                    "High",
                                                    "Medium",
                                                    "Low",
                                                ]}
                                                urgentOption="Urgent"
                                                onSelect={(value) => {
                                                    setPriorityFilter(value);
                                                    setShowFilter(false);
                                                    setFilterSubmenu(null);
                                                }}
                                            />
                                        )}

                                        {/* Lead */}
                                        <FilterMenuItem
                                            label="Lead"
                                            active={filterSubmenu === "lead"}
                                            onClick={() =>
                                                setFilterSubmenu(
                                                    filterSubmenu === "lead"
                                                        ? null
                                                        : "lead"
                                                )
                                            }
                                        />

                                        {filterSubmenu === "lead" && (
                                            <FilterSubmenu
                                                title="Lead"
                                                value={leadFilter}
                                                options={[
                                                    "All",
                                                    "Admin",
                                                    "CN",
                                                ]}
                                                onSelect={(value) => {
                                                    setLeadFilter(value);
                                                    setShowFilter(false);
                                                    setFilterSubmenu(null);
                                                }}
                                            />
                                        )}

                                        {/* Due Date */}
                                        <FilterMenuItem
                                            label="Due Date"
                                            active={filterSubmenu === "dueDate"}
                                            onClick={() =>
                                                setFilterSubmenu(
                                                    filterSubmenu === "dueDate"
                                                        ? null
                                                        : "dueDate"
                                                )
                                            }
                                        />

                                        {filterSubmenu === "dueDate" && (
                                            <FilterSubmenu
                                                title="Due Date"
                                                value={dueDateFilter}
                                                options={[
                                                    "All",
                                                    "Today",
                                                    "Tomorrow",
                                                    "This Week",
                                                    "Overdue",
                                                    "No Due Date",
                                                ]}
                                                onSelect={(value) => {
                                                    setDueDateFilter(value);
                                                    setShowFilter(false);
                                                    setFilterSubmenu(null);
                                                }}
                                            />
                                        )}
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

                        <div className="w-full border border-[#E5E5E5] rounded-lg overflow-visible bg-white">

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
                      relative
                      items-center
                      min-h-[42px]
                      px-3
                      border-b border-[#E5E5E5]
                      hover:bg-[#FAFAFA]
                      transition-colors
                    "
                                    >

                                        {/* Project */}

                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="text-[10px] font-medium text-[#222222] truncate hover:underline"
                                        >
                                            {project.name}
                                        </Link>

                                        {/* Priority */}

                                        <PriorityText
                                            priority={project.priority}
                                        />

                                        {/* Lead */}

                                        <div className="flex items-center gap-2">

                                            <div className="
                          w-5 h-5
                          rounded-full
                          bg-[var(--accent-color)]
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

function FilterMenuItem({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
        w-full
        h-[28px]
        px-3
        flex
        items-center
        justify-between
        text-[9px]
        text-[#333333]
        hover:bg-[#F5F5F5]
      "
        >
            <span>{label}</span>

            <ChevronRight
                size={10}
                strokeWidth={1.5}
            />
        </button>
    );
}

function FilterSubmenu({
    title,
    value,
    options,
    onSelect,
    urgentOption,
}: {
    title: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    urgentOption?: string;
}) {
    return (
        <div
            className="
        absolute
        right-[118px]
        top-0
        z-[60]
        w-[120px]
        rounded-md
        border border-[#E5E5E5]
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        py-1
      "
        >
            <div className="px-3 py-1 text-[8px] text-[#777777]">
                {title}
            </div>

            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    className="
            w-full
            h-[28px]
            px-3
            flex
            items-center
            justify-between
            text-[9px]
            text-[#333333]
            hover:bg-[#F5F5F5]
          "
                >
                    <span
                        className={
                            option === urgentOption
                                ? "text-red-500"
                                : ""
                        }
                    >
                        {option}
                    </span>

                    {value === option && (
                        <span>✓</span>
                    )}
                </button>
            ))}
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
            z-[9999]
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