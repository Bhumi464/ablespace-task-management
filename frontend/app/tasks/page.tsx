"use client";

import { useMemo, useState, useEffect } from "react";
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
  PanelLeft,
  Check,
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

  // Keep task cards synced with saved edits from the task details page.
  const [taskList, setTaskList] = useState(tasks);

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

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return taskList;
    }

    return taskList.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchText) ||
        task.member.toLowerCase().includes(searchText) ||
        task.labels.some((label) =>
          label.toLowerCase().includes(searchText)
        )
      );
    });
  }, [search, taskList]);

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
            <div
              className="flex items-center gap-1.5 relative"
              data-fields-menu
            >

              {/* Search */}
              <button
                type="button"
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
              >
                <Search
                  size={13}
                  strokeWidth={1.8}
                />
              </button>

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
                        ${
                          view === "list"
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
                        ${
                          view === "board"
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
              <button
                type="button"
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
              >
                <Filter
                  size={12}
                  strokeWidth={1.8}
                />
              </button>

              {/* Add Task */}
              <button
                type="button"
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
                            visibleFields={visibleFields}
                          />
                        ))}

                      </div>

                      {/* Add Task */}
                      <button
                        type="button"
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
                      onClick={() =>
                        toggleSection(column.status)
                      }
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
                          className="
                            grid
                            grid-cols-[minmax(250px,1fr)_110px_150px_130px_50px]
                            items-center
                            bg-[#F8F8F8]
                            border-b border-[#E5E5E5]
                            px-3
                            py-2
                          "
                        >

                          <span className="text-[9px] font-medium text-[#555555]">
                            Task
                          </span>

                          <span className="text-[9px] font-medium text-[#555555]">
                            Priority
                          </span>

                          <span className="text-[9px] font-medium text-[#555555]">
                            Members
                          </span>

                          <span className="text-[9px] font-medium text-[#555555]">
                            Due Date
                          </span>

                          <span className="text-[9px] font-medium text-[#555555] text-center">
                            Actions
                          </span>

                        </div>

                        {/* Task Rows */}
                        {columnTasks.map((task) => (

                          <Link
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className="
                              grid
                              grid-cols-[minmax(250px,1fr)_110px_150px_130px_50px]
                              items-center
                              min-h-[38px]
                              px-3
                              border-b
                              last:border-b-0
                              border-[#E5E5E5]
                              hover:bg-[#FAFAFA]
                              transition-colors
                            "
                          >

                            {/* Task */}
                            <div className="min-w-0">

                              <span
                                className="
                                  block
                                  truncate
                                  text-[9px]
                                  font-medium
                                  text-[#222222]
                                "
                              >
                                {task.title}
                              </span>

                            </div>

                            {/* Priority */}
                            <div>
                              <PriorityValue
                                priority={task.priority}
                              />
                            </div>

                            {/* Members */}
                            <div className="flex items-center gap-2">

                              <div
                                className="
                                  w-5 h-5
                                  rounded-full
                                  bg-purple-500
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0
                                "
                              >
                                <UserRound
                                  size={9}
                                  className="text-white"
                                />
                              </div>

                              <span className="text-[9px] text-[#555555] truncate">
                                {task.member}
                              </span>

                            </div>

                            {/* Due Date */}
                            <div>

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  text-[9px]
                                  text-[#555555]
                                "
                              >
                                <CalendarDays
                                  size={10}
                                  strokeWidth={1.7}
                                />

                                {task.dueDate}
                              </span>

                            </div>

                            {/* Actions */}
                            <div className="flex justify-center">

                              <button
                                type="button"
                                onClick={(event) =>
                                  event.preventDefault()
                                }
                                className="
                                  text-[10px]
                                  text-[#888888]
                                  hover:text-[#222222]
                                "
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
      </div>
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
          ${
            checked
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
}) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="
        block
        w-full
        bg-white
        border border-[#DCDCDC]
        rounded-md
        p-2.5
        hover:border-gray-300
        transition
      "
    >

      {/* Title */}
      <div className="flex items-start justify-between gap-1">

        <h3 className="text-[10px] font-medium text-[#111111] leading-[13px] truncate">
          {task.title}
        </h3>

        <button
          type="button"
          onClick={(event) =>
            event.preventDefault()
          }
          className="text-[#888888] text-[8px] shrink-0"
        >
          •••
        </button>

      </div>

      {/* Status */}
      {visibleFields.status && (
        <div className="mt-2">
          <span className="text-[8px] text-[#555555]">
            Status: {task.status}
          </span>
        </div>
      )}

      {/* Priority */}
      {visibleFields.priority && (
        <div className="mt-2">
          <span className="text-[8px] text-[#555555]">
            Priority: {task.priority}
          </span>
        </div>
      )}

      {/* Member + Date */}
      {(visibleFields.members ||
        visibleFields.dueDate) && (

        <div className="flex items-center justify-between mt-2">

          {/* Member */}
          {visibleFields.members && (
            <div className="flex items-center gap-1.5 min-w-0">

              <div
                className="
                  w-4 h-4
                  rounded-full
                  bg-purple-500
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

        <div className="flex flex-wrap gap-1 mt-2">

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
        <div className="mt-2">

          <span className="text-[8px] text-[#555555]">
            Reporter: {task.member}
          </span>

        </div>
      )}

    </Link>
  );
}