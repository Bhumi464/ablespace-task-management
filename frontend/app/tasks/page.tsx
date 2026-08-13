"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Filter,
  Columns2,
  List,
  Plus,
  Search,
  UserRound,
  LayoutGrid,
  Settings,
  PanelLeft,
  Check,
} from "lucide-react";

import { tasks } from "@/data/tasks";

type ViewMode = "board" | "list";

function getListGridTemplate(visibleFields: {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}) {
  const fieldColumns: string[] = [];

  if (visibleFields.priority) fieldColumns.push("110px");
  if (visibleFields.members) fieldColumns.push("150px");
  if (visibleFields.dueDate) fieldColumns.push("130px");
  if (visibleFields.labels) fieldColumns.push("150px");
  if (visibleFields.status) fieldColumns.push("110px");
  if (visibleFields.reporter) fieldColumns.push("130px");

  return `minmax(250px,1fr) ${fieldColumns.join(" ")} 50px`;
}
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
  // Remember the last selected view
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const savedView = sessionStorage.getItem("taskView");

      if (savedView === "list" || savedView === "board") {
        return savedView;
      }
    }

    return "board";
  });

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Keep task cards synced with saved edits from the task details page.
  const [taskList, setTaskList] = useState(tasks);

  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "High",
    member: "Admin",
    dueDate: "",
    labels: "",
  });

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

  useEffect(() => {
    const loadSavedTasks = () => {
      const stored = localStorage.getItem("ablespace-tasks");

      if (!stored) {
        setTaskList(tasks);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTaskList(parsed);
        }
      } catch {
        setTaskList(tasks);
      }
    };

    loadSavedTasks();

    window.addEventListener("ablespace-tasks-updated", loadSavedTasks);
    window.addEventListener("storage", loadSavedTasks);

    return () => {
      window.removeEventListener("ablespace-tasks-updated", loadSavedTasks);
      window.removeEventListener("storage", loadSavedTasks);
    };
  }, []);

  // Fields dropdown
  const [fieldsOpen, setFieldsOpen] = useState(false);

  // Filter dropdown
  const [showFilter, setShowFilter] = useState(false);
  const [filterSubmenu, setFilterSubmenu] = useState<string | null>(null);
const [statusFilter, setStatusFilter] = useState("All");
const [priorityFilter, setPriorityFilter] = useState("All");
const [memberFilter, setMemberFilter] = useState("All");
const [dueDateFilter, setDueDateFilter] = useState("All");
const [teamFilter, setTeamFilter] = useState("All");
const [labelFilter, setLabelFilter] = useState("All");
const [reporterFilter, setReporterFilter] = useState("All");
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

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterRef = useRef<HTMLDivElement>(null);

  // List sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "To Do": true,
    Doing: true,
    Completed: true,
    "On Hold": true,
  });

  const [visibleFields, setVisibleFields] = useState({
    priority: false,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  });

  // Save selected view
  useEffect(() => {
    sessionStorage.setItem("taskView", view);
  }, [view]);

  // Close Fields dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-fields-menu]")) {
        setFieldsOpen(false);
      }
    };

    if (fieldsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fieldsOpen]);

  // Close Filter dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setShowFilter(false);
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

  const filteredTasks = useMemo(() => {
  const searchText = search.toLowerCase().trim();

  return taskList.filter((task) => {
    /* SEARCH */
    const matchesSearch =
      !searchText ||
      task.title.toLowerCase().includes(searchText) ||
      task.member.toLowerCase().includes(searchText) ||
      task.labels.some((label) =>
        label.toLowerCase().includes(searchText)
      );

    /* STATUS */
    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    /* PRIORITY */
    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    /* MEMBERS */
    const matchesMember =
      memberFilter === "All" ||
      task.member === memberFilter;

    /* TEAM */
    const matchesTeam =
      teamFilter === "All" ||
      task.team === teamFilter;

    /* LABELS */
    const matchesLabel =
      labelFilter === "All" ||
      task.labels.includes(labelFilter);

    /* REPORTER */
    const taskReporter =
      (task as typeof task & { reporter?: string }).reporter ||
      task.member;

    const matchesReporter =
      reporterFilter === "All" ||
      taskReporter === reporterFilter;

    /* DUE DATE */
    const matchesDueDate = (() => {
      if (dueDateFilter === "All") {
        return true;
      }

      if (dueDateFilter === "No Due Date") {
        return !task.dueDate || task.dueDate.trim() === "";
      }

      if (dueDateFilter === "Overdue") {
        if (!task.dueDate) return false;

        const taskDate = new Date(task.dueDate);
        const today = new Date();

        if (Number.isNaN(taskDate.getTime())) {
          return false;
        }

        taskDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return taskDate < today;
      }

      if (dueDateFilter === "Today") {
        const taskDate = new Date(task.dueDate);
        const today = new Date();

        if (Number.isNaN(taskDate.getTime())) {
          return false;
        }

        return (
          taskDate.toDateString() === today.toDateString()
        );
      }

      if (dueDateFilter === "Tomorrow") {
        const taskDate = new Date(task.dueDate);
        const tomorrow = new Date();

        if (Number.isNaN(taskDate.getTime())) {
          return false;
        }

        tomorrow.setDate(tomorrow.getDate() + 1);

        return (
          taskDate.toDateString() ===
          tomorrow.toDateString()
        );
      }

      if (dueDateFilter === "This Week") {
        const taskDate = new Date(task.dueDate);

        if (Number.isNaN(taskDate.getTime())) {
          return false;
        }

        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - today.getDay()
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(
          startOfWeek.getDate() + 6
        );
        endOfWeek.setHours(23, 59, 59, 999);

        return (
          taskDate >= startOfWeek &&
          taskDate <= endOfWeek
        );
      }

      return task.dueDate === dueDateFilter;
    })();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesMember &&
      matchesDueDate &&
      matchesTeam &&
      matchesLabel &&
      matchesReporter
    );
  });
}, [
  search,
  taskList,
  statusFilter,
  priorityFilter,
  memberFilter,
  dueDateFilter,
  teamFilter,
  labelFilter,
  reporterFilter,
]);

  const toggleField = (
    field: keyof typeof visibleFields
  ) => {
    setVisibleFields((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const toggleSection = (status: string) => {
    setOpenSections((previous) => ({
      ...previous,
      [status]: !previous[status],
    }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      return;
    }

    const task = {
      id: String(Date.now()),
      title: newTask.title.trim(),
      description:
        newTask.description.trim() ||
        "Add details",
      status: newTask.status,
      priority: newTask.priority,
      member: newTask.member,
      dueDate:
        newTask.dueDate || "29 Jul",
      labels: newTask.labels
        ? newTask.labels
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean)
        : [],
      team: "Development",
    };

    const updatedTasks = [...taskList, task];

    setTaskList(updatedTasks);

    localStorage.setItem(
      "ablespace-tasks",
      JSON.stringify(updatedTasks)
    );

    window.dispatchEvent(
      new Event("ablespace-tasks-updated")
    );

    setNewTask({
      title: "",
      description: "",
      status: "To Do",
      priority: "High",
      member: "Admin",
      dueDate: "",
      labels: "",
    });

    setAddTaskOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = taskList.filter(
      (item) => String(item.id) !== String(taskId)
    );

    setTaskList(updatedTasks);
    localStorage.setItem(
      "ablespace-tasks",
      JSON.stringify(updatedTasks)
    );

    window.dispatchEvent(
      new Event("ablespace-tasks-updated")
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}

        <aside className="w-[155px] shrink-0 border-r border-[#E5E5E5] bg-white">

          {/* Dexter Profile */}
          {/* Dexter Profile */}
          <div
            ref={profileRef}
            className="relative h-[55px] border-b border-[#E5E5E5]"
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
      h-full
      px-4
      flex
      items-center
      justify-between
      hover:bg-[#F8F8F8]
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
                className={`text-[#555555] transition-transform ${profileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {profileOpen && (
              <div
                className="
        absolute
        left-[6px]
        top-[43px]
        z-[9999]
        w-[144px]
        rounded-md
        border
        border-[#E5E5E5]
        bg-white
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        overflow-visible
      "
              >
                {/* Profile */}
                <div className="px-3 pt-3 pb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                      <span className="text-[12px] font-medium text-white">
                        D
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

                {/* Divider */}
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
          "
                  >
                    <span className="flex items-center gap-2">
                      ☼
                      <span>Change Theme</span>
                    </span>

                    <span className="text-[10px]">›</span>
                  </button>

                  {/* Theme submenu */}
                  {themeOpen && (
                    <div
                      className="
              absolute
              left-[142px]
              top-0
              z-[10000]
              w-[100px]
              rounded-md
              border
              border-[#E5E5E5]
              bg-white
              shadow-[0_4px_12px_rgba(0,0,0,0.12)]
              py-1
            "
                    >
                      <div className="px-3 py-1 text-[8px] text-[#777777]">
                        Theme
                      </div>

                      <button
                        type="button"
                        onClick={() => changeTheme("light")}
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
                        <span>☼ Light</span>

                        {theme === "light" && (
                          <span>✓</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => changeTheme("dark")}
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
                        <span>☾ Dark</span>

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
                      {
                      [
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
    onClick={() => {
  changeColorMode(
    item.key as
      | "amber"
      | "blue"
      | "pink"
      | "rose"
      | "emerald"
      | "black"
      | "purple"
  );
}}
    className="w-full h-[28px] px-3 flex items-center justify-between text-left text-[9px] hover:bg-[#F5F5F5]"
  >
    <span className="flex items-center gap-2">
      <span
        className="w-[8px] h-[8px] rounded-[1px]"
        style={{
          backgroundColor: item.color,
        }}
      />

      {item.label}
    </span>

    {colorMode === item.key && (
      <Check size={10} />
    )}
  </button>
))
                      }
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
            <div
              className="flex items-center gap-1.5 relative"
              data-fields-menu
            >

              {/* Search */}
{searchOpen ? (
  <div className="relative flex items-center">
    <Search
      size={13}
      strokeWidth={1.8}
      className="absolute left-2 text-[#777777]"
    />

    <input
      type="text"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search tasks..."
      autoFocus
      className="
        w-[180px]
        h-7
        border border-[#E5E5E5]
        rounded-md
        pl-7
        pr-7
        text-[10px]
        text-[#222222]
        bg-white
        outline-none
        focus:border-[#BBBBBB]
      "
    />

    {search && (
      <button
        type="button"
        onClick={() => setSearch("")}
        className="
          absolute
          right-2
          text-[#888888]
          hover:text-black
          text-[12px]
        "
      >
        ×
      </button>
    )}
  </div>
) : (
  <button
    type="button"
    onClick={() => setSearchOpen(true)}
    className="
      w-7 h-7
      border border-[#E5E5E5]
      rounded-md
      flex items-center justify-center
      text-[#444444]
      bg-white
      hover:bg-[#E8E8E8]
      hover:border-[#CFCFCF]
      hover:text-black
      transition-all duration-150
    "
    title="Search"
  >
    <Search
      size={13}
      strokeWidth={1.8}
    />
  </button>
)}

              {/* Fields */}
              <button
                type="button"
                onClick={() =>
                  setFieldsOpen((previous) => !previous)
                }
                className="
                  h-7 px-2.5
                  border border-[#E5E5E5]
                  rounded-md
                  text-[10px]
                  font-medium
                  text-[#333333]
                  bg-white
                  flex items-center gap-1.5
                  hover:bg-[#E8E8E8]
                  hover:border-[#CFCFCF]
                  hover:text-black
                  transition-all duration-150
                "
              >
                <Columns2
                  size={12}
                  strokeWidth={1.8}
                />

                <span>Fields</span>
              </button>

              {/* ================= FIELDS DROPDOWN ================= */}

              {fieldsOpen && (
                <div
                  className="
                    absolute
                    right-[58px]
                    top-[34px]
                    z-50
                    w-[180px]
                    rounded-md
                    border border-[#E5E5E5]
                    bg-white
                    shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                  "
                >

                  {/* View Toggle */}
                  <div className="flex h-[32px] border-b border-[#E5E5E5] p-1">

                    {/* List */}
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className={`
                        flex-1
                        rounded-[4px]
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        text-[9px]
                        font-medium
                        ${view === "list"
                          ? "bg-[#F3F3F3] text-[#111111]"
                          : "text-[#666666] hover:bg-[#F8F8F8]"
                        }
                      `}
                    >
                      <List
                        size={11}
                        strokeWidth={1.8}
                      />

                      <span>List</span>
                    </button>

                    {/* Board */}
                    <button
                      type="button"
                      onClick={() => setView("board")}
                      className={`
                        flex-1
                        rounded-[4px]
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        text-[9px]
                        font-medium
                        ${view === "board"
                          ? "bg-[#F3F3F3] text-[#111111]"
                          : "text-[#666666] hover:bg-[#F8F8F8]"
                        }
                      `}
                    >
                      <LayoutGrid
                        size={11}
                        strokeWidth={1.8}
                      />

                      <span>Board</span>
                    </button>

                  </div>

                  {/* Fields */}
                  <div className="py-1.5">

                    <FieldOption
                      label="Priority"
                      checked={visibleFields.priority}
                      onClick={() =>
                        toggleField("priority")
                      }
                    />

                    <FieldOption
                      label="Members"
                      checked={visibleFields.members}
                      onClick={() =>
                        toggleField("members")
                      }
                    />

                    <FieldOption
                      label="Due Date"
                      checked={visibleFields.dueDate}
                      onClick={() =>
                        toggleField("dueDate")
                      }
                    />

                    <FieldOption
                      label="Labels"
                      checked={visibleFields.labels}
                      onClick={() =>
                        toggleField("labels")
                      }
                    />

                    <FieldOption
                      label="Status"
                      checked={visibleFields.status}
                      onClick={() =>
                        toggleField("status")
                      }
                    />

                    <FieldOption
                      label="Reporter"
                      checked={visibleFields.reporter}
                      onClick={() =>
                        toggleField("reporter")
                      }
                    />

                  </div>
                </div>
              )}

              {/* Filter */}
<div
  ref={filterRef}
  className="relative"
>
  <button
    type="button"
    onClick={() => {
      setShowFilter((previous) => !previous);
      setFilterSubmenu(null);
      setFieldsOpen(false);
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

      {/* STATUS */}
      <FilterMenuItem
        label="Status"
        active={filterSubmenu === "status"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "status" ? null : "status"
          )
        }
      />

      {filterSubmenu === "status" && (
        <FilterSubmenu
          title="Status"
          value={statusFilter}
          options={[
            "All",
            "To Do",
            "Doing",
            "Completed",
            "On Hold",
          ]}
          onSelect={(value) => {
            setStatusFilter(value);
            setShowFilter(false);
            setFilterSubmenu(null);
          }}
        />
      )}

      {/* PRIORITY */}
      <FilterMenuItem
        label="Priority"
        active={filterSubmenu === "priority"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "priority" ? null : "priority"
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

      {/* MEMBERS */}
      <FilterMenuItem
        label="Members"
        active={filterSubmenu === "members"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "members" ? null : "members"
          )
        }
      />

      {filterSubmenu === "members" && (
        <FilterSubmenu
          title="Members"
          value={memberFilter}
          options={[
            "All",
            "Admin",
            "CN",
            "QA Team",
            "Designer",
            "Developer",
            "Security",
          ]}
          onSelect={(value) => {
            setMemberFilter(value);
            setShowFilter(false);
            setFilterSubmenu(null);
          }}
        />
      )}

      {/* DUE DATE */}
      <FilterMenuItem
        label="Due Date"
        active={filterSubmenu === "dueDate"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "dueDate" ? null : "dueDate"
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

      {/* TEAMS */}
      <FilterMenuItem
        label="Teams"
        active={filterSubmenu === "teams"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "teams" ? null : "teams"
          )
        }
      />

      {filterSubmenu === "teams" && (
        <FilterSubmenu
          title="Teams"
          value={teamFilter}
          options={[
            "All",
            "Development",
            "Design",
            "QA",
            "Security",
          ]}
          onSelect={(value) => {
            setTeamFilter(value);
            setShowFilter(false);
            setFilterSubmenu(null);
          }}
        />
      )}

      {/* LABELS */}
      <FilterMenuItem
        label="Labels"
        active={filterSubmenu === "labels"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "labels" ? null : "labels"
          )
        }
      />

      {filterSubmenu === "labels" && (
        <FilterSubmenu
          title="Labels"
          value={labelFilter}
          options={[
            "All",
            "Research",
            "Development",
            "Design",
            "Testing",
            "Deployment",
            "Review",
            "Audit",
          ]}
          onSelect={(value) => {
            setLabelFilter(value);
            setShowFilter(false);
            setFilterSubmenu(null);
          }}
        />
      )}

      {/* REPORTER */}
      <FilterMenuItem
        label="Reporter"
        active={filterSubmenu === "reporter"}
        onClick={() =>
          setFilterSubmenu(
            filterSubmenu === "reporter" ? null : "reporter"
          )
        }
      />

      {filterSubmenu === "reporter" && (
        <FilterSubmenu
          title="Reporter"
          value={reporterFilter}
          options={[
            "All",
            "Admin",
            "CN",
            "QA Team",
            "Designer",
            "Developer",
            "Security",
          ]}
          onSelect={(value) => {
            setReporterFilter(value);
            setShowFilter(false);
            setFilterSubmenu(null);
          }}
        />
      )}

    </div>
  )}
</div>

              {/* Add Task */}
              <button
                type="button"
                onClick={() => {
                  setNewTask((previous) => ({
                    ...previous,
                    status: "To Do",
                  }));
                  setAddTaskOpen(true);
                }}
                className="
                  h-7 px-3
                  rounded-md
                  bg-black
                  text-white
                  text-[10px]
                  font-medium
                  flex items-center gap-1.5
                  hover:bg-[#333333]
                  transition-all duration-150
                "
              >
                <Plus size={12} />

                <span>Add Task</span>
              </button>

            </div>
          </header>

          {/* ================= BOARD VIEW ================= */}

          {view === "board" && (
            <div className="w-full px-4 py-4">

              <div className="grid grid-cols-4 gap-2.5 w-full">

                {columns.map((column) => {

                  const columnTasks =
                    filteredTasks.filter(
                      (task) =>
                        task.status === column.status
                    );

                  return (
                    <div
                      key={column.status}
                      className="
                        min-w-0
                        w-full
                        bg-[#F8F8F8]
                        border border-[#E5E5E5]
                        rounded-lg
                        p-2
                        min-h-[350px]
                      "
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

                      </div>

                      {/* Cards */}
                      <div className="space-y-1.5">

                        {columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            visibleFields={visibleFields}
                            onDelete={handleDeleteTask}
                          />
                        ))}

                      </div>

                      {/* Add Task */}
                      <button
                        type="button"
                        onClick={() => {
                          setNewTask((previous) => ({
                            ...previous,
                            status: column.status,
                          }));

                          setAddTaskOpen(true);
                        }}
                        className="
                          w-full
                          text-left
                          text-[8px]
                          text-[#555555]
                          mt-2
                          px-1
                          hover:text-black
                        "
                      >
                        + Add Task
                      </button>

                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* ================= LIST VIEW ================= */}

          {view === "list" && (
            <div className="w-full px-5 py-4">

              {columns.map((column) => {

                const columnTasks =
                  filteredTasks.filter(
                    (task) =>
                      task.status === column.status
                  );

                const isOpen =
                  openSections[column.status];

                return (
                  <section
                    key={column.status}
                    className="mb-5"
                  >

                    {/* Section Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(column.status)}
                      className="
                        flex
                        items-center
                        gap-1.5
                        mb-2
                        text-left
                        hover:text-black
                      "
                    >

                      {isOpen ? (
                        <ChevronDown
                          size={11}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <ChevronRight
                          size={11}
                          strokeWidth={1.8}
                        />
                      )}

                      <span className="text-[10px] font-semibold text-[#111111]">
                        {column.title}
                      </span>

                    </button>

                    {isOpen && (
                      <div
                        className="
                          w-full
                          border border-[#E5E5E5]
                          rounded-md
                          overflow-hidden
                          bg-white
                        "
                      >

                        {/* Table Header */}
                        <div
                          className="grid items-center bg-[#F8F8F8] border-b border-[#E5E5E5] px-3 py-2"
                          style={{
                            gridTemplateColumns:
                              getListGridTemplate(visibleFields),
                          }}
                        >
                          <span className="text-[9px] font-medium text-[#555555]">
                            Task
                          </span>

                          {visibleFields.priority && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Priority
                            </span>
                          )}

                          {visibleFields.members && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Members
                            </span>
                          )}

                          {visibleFields.dueDate && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Due Date
                            </span>
                          )}

                          {visibleFields.labels && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Labels
                            </span>
                          )}

                          {visibleFields.status && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Status
                            </span>
                          )}

                          {visibleFields.reporter && (
                            <span className="text-[9px] font-medium text-[#555555]">
                              Reporter
                            </span>
                          )}

                          <span className="text-[9px] font-medium text-[#555555] text-center">
                            Actions
                          </span>
                        </div>

                        {/* Task Rows */}
                        {columnTasks.map((task) => (
                          <Link
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className="grid items-center min-h-[38px] px-3 border-b last:border-b-0 border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
                            style={{
                              gridTemplateColumns:
                                getListGridTemplate(visibleFields),
                            }}
                          >
                            {/* Task */}
                            <div className="min-w-0">
                              <span className="block truncate text-[9px] font-medium text-[#222222]">
                                {task.title}
                              </span>
                            </div>

                            {/* Priority */}
                            {visibleFields.priority && (
                              <div>
                                <PriorityValue priority={task.priority} />
                              </div>
                            )}

                            {/* Members */}
                            {visibleFields.members && (
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-5 h-5 rounded-full bg-[var(--accent-color)] flex items-center justify-center shrink-0">
                                  <UserRound
                                    size={9}
                                    className="text-white"
                                  />
                                </div>

                                <span className="text-[9px] text-[#555555] truncate">
                                  {task.member}
                                </span>
                              </div>
                            )}

                            {/* Due Date */}
                            {visibleFields.dueDate && (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[9px] text-[#555555]">
                                  <CalendarDays
                                    size={10}
                                    strokeWidth={1.7}
                                  />
                                  {task.dueDate}
                                </span>
                              </div>
                            )}

                            {/* Labels */}
                            {visibleFields.labels && (
                              <div className="flex flex-wrap gap-1 min-w-0">
                                {task.labels.map((label) => (
                                  <span
                                    key={label}
                                    className="border border-[#E5E5E5] rounded-full px-1.5 py-0.5 text-[7px] text-[#555555] truncate"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Status */}
                            {visibleFields.status && (
                              <div>
                                <span className="text-[9px] text-[#555555]">
                                  {task.status}
                                </span>
                              </div>
                            )}

                            {/* Reporter */}
                            {visibleFields.reporter && (
                              <div>
                                <span className="text-[9px] text-[#555555] truncate">
                                  {task.member}
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={(event) =>
                                  event.preventDefault()
                                }
                                className="text-[10px] text-[#888888] hover:text-[#222222]"
                              >
                                •••
                              </button>
                            </div>
                          </Link>
                        ))}

                        {/* Empty State */}
                        {columnTasks.length === 0 && (
                          <div className="px-3 py-4 text-[9px] text-[#999999]">
                            No tasks found.
                          </div>
                        )}

                        {/* Add Task */}
                        <button
                          type="button"
                          onClick={() => {
                            setNewTask((previous) => ({
                              ...previous,
                              status: column.status,
                            }));

                            setAddTaskOpen(true);
                          }}
                          className="
                            flex
                            items-center
                            gap-1
                            w-full
                            px-3
                            py-2
                            text-left
                            text-[9px]
                            text-[#555555]
                            hover:text-black
                            hover:bg-[#FAFAFA]
                          "
                        >
                          <Plus size={10} />

                          <span>Add Task</span>
                        </button>

                      </div>
                    )}

                  </section>
                );
              })}

            </div>
          )}

        </main>

        {/* ================= ADD TASK MODAL ================= */}
        {addTaskOpen && (
          <div className="fixed inset-0 z-[100] bg-black/20 flex items-center justify-center">
            <div className="w-[380px] bg-white rounded-lg border border-[#E5E5E5] shadow-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-[#111111]">
                  Add Task
                </h2>

                <button
                  type="button"
                  onClick={() => setAddTaskOpen(false)}
                  className="text-gray-400 hover:text-black text-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {/* Task Name */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Task
                  </label>
                  <input
                    value={newTask.title}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Enter task name"
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none focus:border-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Enter description"
                    className="w-full h-16 border border-gray-200 rounded-md px-3 py-2 text-[10px] outline-none resize-none focus:border-gray-400"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        priority: event.target.value,
                      }))
                    }
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Member */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Member
                  </label>
                  <select
                    value={newTask.member}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        member: event.target.value,
                      }))
                    }
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="CN">CN</option>
                    <option value="Designer">Designer</option>
                    <option value="Developer">Developer</option>
                    <option value="QA Team">QA Team</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        dueDate: event.target.value,
                      }))
                    }
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none"
                  />
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Labels
                  </label>
                  <input
                    value={newTask.labels}
                    onChange={(event) =>
                      setNewTask((previous) => ({
                        ...previous,
                        labels: event.target.value,
                      }))
                    }
                    placeholder="Research, Development"
                    className="w-full h-9 border border-gray-200 rounded-md px-3 text-[10px] outline-none focus:border-gray-400"
                  />
                  <p className="text-[8px] text-gray-400 mt-1">
                    Separate labels with commas.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setAddTaskOpen(false)}
                  className="h-8 px-3 rounded-md border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="h-8 px-4 rounded-md bg-black text-white text-[10px] font-medium hover:bg-gray-800"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ================= FILTER MENU ITEM ================= */

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


/* ================= FILTER SUBMENU ================= */

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
        border
        border-[#E5E5E5]
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

/* ================= FIELD OPTION ================= */

function FieldOption({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        h-[29px]
        px-3
        flex
        items-center
        justify-between
        text-left
        hover:bg-[#F1F1F1]
        transition-colors
      "
    >

      <span className="text-[9px] text-[#333333]">
        {label}
      </span>

      <span
        className={`
          w-[11px]
          h-[11px]
          rounded-[3px]
          border
          flex
          items-center
          justify-center
          ${checked
            ? "bg-[#111111] border-[#111111]"
            : "bg-white border-[#DCDCDC]"
          }
        `}
      >
        {checked && (
          <Check
            size={8}
            strokeWidth={2.5}
            className="text-white"
          />
        )}
      </span>

    </button>
  );
}

/* ================= PRIORITY ================= */

function PriorityValue({
  priority,
}: {
  priority: string;
}) {
  let textClass = "text-[#777777]";

  if (priority.toLowerCase() === "high") {
    textClass = "text-[#FF4D4D]";
  }

  if (priority.toLowerCase() === "medium") {
    textClass = "text-[#FF8A3D]";
  }

  if (priority.toLowerCase() === "low") {
    textClass = "text-[#999999]";
  }

  return (
    <span
      className={`text-[9px] ${textClass}`}
    >
      {priority}
    </span>
  );
}

/* ================= TASK CARD ================= */

function TaskCard({
  task,
  visibleFields,
  onDelete,
}: {
  task: (typeof tasks)[number];
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
  onDelete: (taskId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = () => {
      setMenuOpen(false);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="
        block
        w-full
        bg-white
        border border-[#DCDCDC]
        rounded-md
        p-2
        hover:border-gray-300
        transition
      "
    >

      {/* Title */}
      <div className="flex items-start justify-between gap-1">

        <h3 className="text-[10px] font-medium text-[#111111] leading-[13px] truncate">
          {task.title}
        </h3>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="text-[#777777] text-[9px] leading-none px-1 py-0.5 hover:text-black"
            aria-label="Task actions"
          >
            •••
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                right-0
                top-5
                z-50
                w-[110px]
                rounded-md
                border
                border-[#E5E5E5]
                bg-white
                shadow-lg
                py-1
              "
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/tasks/${task.id}`;
                }}
                className="
                  w-full
                  text-left
                  px-3
                  py-2
                  text-[9px]
                  text-[#333333]
                  hover:bg-[#F5F5F5]
                "
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(String(task.id));
                }}
                className="
                  w-full
                  text-left
                  px-3
                  py-2
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

      </div>

      {/* Status */}
      {visibleFields.status && (
        <div className="mt-1">
          <span className="text-[8px] text-[#555555]">
            Status: {task.status}
          </span>
        </div>
      )}

      {/* Priority */}
      {visibleFields.priority && (
        <div className="mt-1">
          <span className="text-[8px] text-[#555555]">
            Priority: {task.priority}
          </span>
        </div>
      )}

      {/* Member + Date */}
      {(visibleFields.members ||
        visibleFields.dueDate) && (

          <div className="flex items-center justify-between mt-1">

            {/* Member */}
            {visibleFields.members && (
              <div className="flex items-center gap-1.5 min-w-0">

                <div
                  className="
                  w-4 h-4
                  rounded-full
                  bg-[var(--accent-color)]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                >
                  <UserRound
                    size={8}
                    className="text-white"
                  />
                </div>

                <span className="text-[8px] text-[#555555] truncate">
                  {task.member}
                </span>

              </div>
            )}

            {/* Date */}
            {visibleFields.dueDate && (
              <span
                className="
                inline-flex
                items-center
                gap-0.5
                bg-red-50
                text-red-500
                rounded-full
                px-1.5
                py-0.5
                text-[7px]
                shrink-0
                ml-2
              "
              >
                <CalendarDays size={8} />

                {task.dueDate}
              </span>
            )}

          </div>
        )}

      {/* Labels */}
      {visibleFields.labels &&
        task.labels.length > 0 && (

          <div className="flex flex-wrap gap-1 mt-1">

            {task.labels.map((label) => (

              <span
                key={label}
                className="
                border border-[#E5E5E5]
                rounded-full
                px-1.5
                py-0.5
                text-[7px]
                text-[#555555]
              "
              >
                {label}
              </span>

            ))}

          </div>
        )}

      {/* Reporter */}
      {visibleFields.reporter && (
        <div className="mt-1">

          <span className="text-[8px] text-[#555555]">
            Reporter: {task.member}
          </span>

        </div>
      )}

    </Link>
  );
}