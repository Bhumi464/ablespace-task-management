"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { tasks } from "@/data/tasks";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Eye,
  Grid2X2,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Settings,
  Share2,
  Smile,
  List,
} from "lucide-react";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const initialTask = tasks.find((item) => item.id === id);
  const [currentTask, setCurrentTask] = useState<typeof initialTask>(initialTask);
  const [isLoadingTask, setIsLoadingTask] = useState(true);

  // Use the saved task from localStorage when the task was created
  // from the Add Task form.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ablespace-tasks");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const savedTask = parsed.find(
            (item) => String(item.id) === String(id)
          );

          if (savedTask) {
            setCurrentTask(savedTask);
          }
        }
      }
    } catch {
      // Keep the original task from the static data if localStorage fails.
    } finally {
      setIsLoadingTask(false);
    }
  }, [id]);

  const task = currentTask;

  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLInputElement>(null);
  const [replies, setReplies] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const [documents, setDocuments] = useState<
    { name: string; size: number; type: string; dataUrl: string }[]
  >([]);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!task) return;

    try {
      const savedComments = localStorage.getItem(`task-comments-${task.id}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }

      const savedReplies = localStorage.getItem(`task-replies-${task.id}`);
      if (savedReplies) {
        setReplies(JSON.parse(savedReplies));
      }

      const savedDocuments = localStorage.getItem(
        `task-documents-${task.id}`
      );

      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      }
    } catch {
      setComments([]);
    }
  }, [task?.id]);

  const addComment = () => {
    const text = commentText.trim();

    if (!text || !task) return;

    const nextComments = [...comments, text];

    setComments(nextComments);
    setCommentText("");

    localStorage.setItem(
      `task-comments-${task.id}`,
      JSON.stringify(nextComments)
    );
  };

  const addReply = () => {
    const text = replyText.trim();

    if (!text || !task) return;

    const nextReplies = [...replies, text];

    setReplies(nextReplies);
    setReplyText("");

    localStorage.setItem(
      `task-replies-${task.id}`,
      JSON.stringify(nextReplies)
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDocumentUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!task || !event.target.files?.length) return;

    const files = Array.from(event.target.files);

    try {
      const uploadedDocuments = await Promise.all(
        files.map(
          (file) =>
            new Promise<{
              name: string;
              size: number;
              type: string;
              dataUrl: string;
            }>((resolve, reject) => {
              const reader = new FileReader();

              reader.onload = () => {
                resolve({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  dataUrl: String(reader.result),
                });
              };

              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      const nextDocuments = [...documents, ...uploadedDocuments];

      setDocuments(nextDocuments);

      localStorage.setItem(
        `task-documents-${task.id}`,
        JSON.stringify(nextDocuments)
      );
    } catch {
      alert("The document could not be added.");
    }

    event.target.value = "";
  };

  const removeDocument = (index: number) => {
    if (!task) return;

    const nextDocuments = documents.filter((_, i) => i !== index);

    setDocuments(nextDocuments);

    localStorage.setItem(
      `task-documents-${task.id}`,
      JSON.stringify(nextDocuments)
    );
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleLock = () => {
    setIsLocked((locked) => !locked);
  };

  const handlePreview = () => {
    setShowPreview((visible) => !visible);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("Copy the page URL from the address bar");
    }

    window.setTimeout(() => setShareMessage(""), 1800);
  };

  const handleDelete = () => {
    if (!task) return;

    const confirmed = window.confirm(
      `Delete "${task.title}" from this page?`
    );

    if (confirmed) {
      window.location.href = "/tasks";
    }
  };

  const handleSettings = () => {
    setShowSettings((visible) => !visible);
  };

  const focusReply = () => {
    replyInputRef.current?.focus();
  };

  if (isLoadingTask) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading task...</p>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Task not found
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            The task you are looking for does not exist.
          </p>

          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 mt-5 text-sm text-gray-700 hover:text-black"
          >
            <ArrowLeft size={15} />
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  // Keep the page in sync with saved task changes.
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-[160px] border-r border-gray-200 bg-white">

        {/* Workspace Header */}
        <div className="h-[50px] border-b border-gray-200 flex items-center px-4">
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-[9px]">
            D
          </div>

          <span className="ml-2 text-[10px] font-semibold text-gray-900">
            Dexter
          </span>

          <ChevronDown
            size={11}
            className="ml-auto text-gray-500"
          />
        </div>

        {/* Workspace */}
        <div className="px-3 pt-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[9px] text-gray-500">
              Workspace
            </span>

            <ChevronDown
              size={10}
              className="text-gray-500"
            />
          </div>

          {/* Tasks */}
          <Link
            href="/tasks"
            className="flex items-center gap-2 px-2 py-2 rounded-md bg-gray-100 text-gray-900"
          >
            <List size={13} />
            <span className="text-[10px]">
              Tasks
            </span>
          </Link>

          {/* Projects */}
          <div className="flex items-center gap-2 px-2 py-2 text-gray-700">
            <Grid2X2 size={12} />
            <span className="text-[10px]">
              Projects
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="ml-[160px]">

        {/* TOP BAR */}
        <header className="group h-[50px] border-b border-gray-200 flex items-center justify-between px-5">

          <Link
            href="/tasks"
            className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-black"
          >
            <ArrowLeft size={13} />
            Back to Tasks
          </Link>

          <div ref={actionMenuRef} className="relative flex items-center gap-1">

            <button
              type="button"
              title={isLocked ? "Unlock task" : "Lock task"}
              onClick={handleLock}
              className={`h-7 flex items-center gap-1.5 px-2 rounded-md text-[9px] ${
                isLocked
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Lock size={12} />
              <span>{isLocked ? "Locked" : "Unlocked"}</span>
            </button>

            <button
              type="button"
              title={showPreview ? "Close preview" : "Preview"}
              onClick={handlePreview}
              className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <Eye size={13} />
            </button>

            <button
              type="button"
              title="Copy share link"
              onClick={handleShare}
              className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <Share2 size={13} />
            </button>

            <button
              type="button"
              title="More actions"
              onClick={() => { setShowMoreMenu((open) => !open); setShowSettings(false); }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <MoreHorizontal size={14} />
            </button>

            <button
              type="button"
              title="Settings"
              onClick={() => { setShowSettings((open) => !open); setShowMoreMenu(false); }}
              className={`w-7 h-7 flex items-center justify-center rounded-md ${
                showSettings
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Settings size={13} />
            </button>

            {shareMessage && (
              <div className="absolute right-0 top-9 z-50 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[9px] text-gray-700 shadow-sm">
                {shareMessage}
              </div>
            )}

            {showMoreMenu && (
              <div className="absolute right-7 top-9 z-50 w-32 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowSettings(false);
                    window.print();
                  }}
                  className="w-full rounded px-2 py-1.5 text-left text-[9px] text-gray-700 hover:bg-gray-100"
                >
                  Print task
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowSettings(false);
                    handleDelete();
                  }}
                  className="w-full rounded px-2 py-1.5 text-left text-[9px] text-red-500 hover:bg-red-50"
                >
                  Remove from view
                </button>
              </div>
            )}

            {showSettings && (
              <div className="absolute right-0 top-9 z-50 w-44 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                <p className="text-[10px] font-semibold text-gray-900">
                  Task settings
                </p>

                <p className="mt-1 text-[9px] text-gray-500">
                  {isLocked
                    ? "Editing is locked."
                    : "Task editing is enabled."}
                </p>

                <button
                  type="button"
                  onClick={handleLock}
                  className="mt-3 w-full rounded border border-gray-200 px-2 py-1.5 text-[9px] text-gray-700 hover:bg-gray-50"
                >
                  {isLocked ? "Unlock task" : "Lock task"}
                </button>
              </div>
            )}

            {showPreview && (
              <div className="fixed inset-0 z-40 bg-black/20 flex items-center justify-center">
                <div className="w-[520px] max-w-[90vw] rounded-lg bg-white border border-gray-200 shadow-xl p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Task Preview
                    </h2>

                    <button
                      type="button"
                      onClick={handlePreview}
                      className="text-gray-400 hover:text-black text-sm"
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-gray-900">
                    {currentTask.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {currentTask.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-200 px-2 py-1 text-[9px] text-gray-600">
                      {currentTask.status}
                    </span>
                    <span className="rounded-full border border-gray-200 px-2 py-1 text-[9px] text-gray-600">
                      {currentTask.priority}
                    </span>
                    <span className="rounded-full border border-gray-200 px-2 py-1 text-[9px] text-gray-600">
                      {currentTask.member}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="max-w-[850px] mx-auto px-4 py-5">

          {/* TITLE */}
          <div className="mb-5">

            <h1 className="text-[18px] font-semibold text-gray-900">
              {currentTask.title}
            </h1>

            <p className="mt-1 text-[10px] leading-4 text-gray-500 max-w-[600px]">
              {currentTask.description}
            </p>

          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-[minmax(0,1fr)_210px] gap-4">

            {/* LEFT CONTENT */}
            <section className="min-w-0">

              {/* PROPERTIES */}
              <div className="mb-4">

                <h2 className="text-[10px] font-semibold text-gray-900 mb-2">
                  Properties
                </h2>

                <div className="flex items-center gap-2 flex-wrap">

                  <PropertyPill
                    label="Status"
                    value={currentTask.status}
                  />

                  <PropertyPill
                    label="Priority"
                    value={currentTask.priority}
                  />

                  <PropertyPill
                    label="Members"
                    value={currentTask.member}
                  />

                  <PropertyPill
                    label="Date"
                    value={currentTask.dueDate}
                  />

                </div>
              </div>

              {/* LABELS */}
              <div className="mb-4">

                <h2 className="text-[10px] font-semibold text-gray-900 mb-2">
                  Labels
                </h2>

                <div className="flex flex-wrap gap-1.5">

                  {currentTask.labels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-2 py-1 text-[9px] text-gray-600"
                    >
                      <span className="text-gray-400">
                        ◇
                      </span>

                      {label}
                    </span>
                  ))}

                </div>
              </div>

              {/* RESOURCES */}
              <div className="mb-4">
                <h2 className="text-[10px] font-semibold text-gray-900 mb-2">
                  Resources
                </h2>

                <input
                  ref={documentInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleDocumentUpload}
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.csv,.jpg,.jpeg,.png,.webp"
                />

                <button
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[9px] text-gray-400 hover:text-gray-700"
                >
                  <Paperclip size={11} />
                  Add document or link...
                </button>

                {documents.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {documents.map((document, index) => (
                      <div
                        key={`${document.name}-${index}`}
                        className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5"
                      >
                        <Paperclip
                          size={11}
                          className="text-gray-500 shrink-0"
                        />

                        <a
                          href={document.dataUrl}
                          download={document.name}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-0 flex-1 truncate text-[9px] text-gray-700 hover:text-black hover:underline"
                          title={document.name}
                        >
                          {document.name}
                        </a>

                        <span className="text-[8px] text-gray-400 shrink-0">
                          {formatFileSize(document.size)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-[11px] text-gray-400 hover:text-red-500 shrink-0"
                          aria-label={`Remove ${document.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBTASKS */}
              <div className="border border-gray-200 rounded-md overflow-hidden">

                <div className="h-8 px-3 border-b border-gray-200 flex items-center justify-between">

                  <h2 className="text-[10px] font-semibold text-gray-900">
                    Subtasks
                  </h2>

                  <button className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-black">
                    <Plus size={11} />
                    Add Subtasks
                  </button>

                </div>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-[1fr_75px_90px_95px_25px] bg-gray-50 border-b border-gray-200 px-3 py-2">

                  <span className="text-[8px] font-medium text-gray-500">
                    Task
                  </span>

                  <span className="text-[8px] font-medium text-gray-500">
                    Priority
                  </span>

                  <span className="text-[8px] font-medium text-gray-500">
                    Members
                  </span>

                  <span className="text-[8px] font-medium text-gray-500">
                    Due Date
                  </span>

                  <span className="text-[8px] font-medium text-gray-500">
                    Actions
                  </span>

                </div>

                <SubtaskRow
                  title="Subtask 1"
                  priority="High"
                  member="Admin"
                  date="12 Sep 2026"
                />

                <SubtaskRow
                  title="Subtask 2"
                  priority="Low"
                  member="CN"
                  date="15 Sep 2026"
                />

                <SubtaskRow
                  title="Subtask 3"
                  priority="Medium"
                  member="+"
                  date="18 Sep 2026"
                />

                <button className="px-3 py-2 text-[8px] text-gray-500 hover:text-black">
                  + Add Subtasks
                </button>

              </div>

              {/* COMMENTS */}
              <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">

                <div className="px-3 py-2 border-b border-gray-200">

                  <h2 className="text-[10px] font-semibold text-gray-900">
                    Subtasks
                  </h2>

                </div>

                {/* COMMENT */}
                <div className="px-3 py-3 border-b border-gray-200">

                  <div className="flex gap-2">

                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px] shrink-0">
                      {currentTask.member.charAt(0)}
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <p className="text-[9px] font-medium text-gray-900">
                          {currentTask.member}
                        </p>

                        <span className="text-[8px] text-gray-400">
                          just now
                        </span>

                      </div>

                      <p className="text-[9px] text-gray-600 mt-1">
                        Documentation is currently being reviewed.
                      </p>

                      <div className="flex items-center gap-3 mt-2">

                        <button
                          type="button"
                          onClick={focusReply}
                          className="text-[8px] text-gray-400 hover:text-black"
                        >
                          Reply
                        </button>

                        <button className="text-[8px] text-gray-400 hover:text-black">
                          ...
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                {/* REPLY */}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addReply();
                  }}
                  className="px-3 py-2 border-b border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-600">
                      A
                    </div>

                    <div className="flex-1 border border-gray-200 rounded-md px-2 py-1.5">
                      <input
                        ref={replyInputRef}
                        type="text"
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value)}
                        placeholder="Leave a reply..."
                        className="w-full outline-none text-[9px] text-gray-700 placeholder:text-gray-400"
                      />
                    </div>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-black"
                      onClick={() => replyInputRef.current?.focus()}
                    >
                      <Smile size={13} />
                    </button>

                    <button
                      type="submit"
                      disabled={isLocked || !replyText.trim()}
                      aria-label="Send reply"
                      className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </form>

                {replies.length > 0 && (
                  <div className="border-b border-gray-200">
                    {replies.map((reply, index) => (
                      <div
                        key={`${reply}-${index}`}
                        className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] text-gray-600 shrink-0">
                            A
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[9px] font-medium text-gray-900">
                                You
                              </p>
                              <span className="text-[8px] text-gray-400">
                                just now
                              </span>
                            </div>

                            <p className="text-[9px] text-gray-600 mt-1 whitespace-pre-wrap">
                              {reply}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* COMMENTS */}
                {comments.length > 0 && (
                  <div className="border-b border-gray-200">
                    {comments.map((comment, index) => (
                      <div
                        key={`${comment}-${index}`}
                        className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[8px] shrink-0">
                            {currentTask.member.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[9px] font-medium text-gray-900">
                                {currentTask.member}
                              </p>
                              <span className="text-[8px] text-gray-400">
                                just now
                              </span>
                            </div>

                            <p className="text-[9px] text-gray-600 mt-1 whitespace-pre-wrap">
                              {comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADD COMMENT */}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addComment();
                  }}
                  className="p-3"
                >
                  <div className="border border-gray-200 rounded-md p-2">
                    <textarea
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="Add a comment..."
                      className="w-full h-12 resize-none outline-none text-[9px] text-gray-700 placeholder:text-gray-400"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="bg-black text-white text-[9px] px-3 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </form>

              </div>

            </section>

            {/* RIGHT DETAILS */}
            <aside className="h-fit">

              <EditableDetails
                task={currentTask}
                locked={isLocked}
                onSave={(updatedTask) => setCurrentTask(updatedTask)}
              />

              {/* UPDATES */}
              <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">

                <div className="px-3 py-2.5 flex items-center justify-between">

                  <h3 className="text-[10px] font-semibold text-gray-900">
                    Updates
                  </h3>

                  <ChevronDown
                    size={11}
                    className="text-gray-400"
                  />

                </div>

                <div className="px-3 pb-3 space-y-3">

                  <div className="flex gap-2">

                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-500 shrink-0">
                      A
                    </div>

                    <div>

                      <p className="text-[8px] font-medium text-gray-800">
                        You
                      </p>

                      <p className="text-[8px] text-gray-500 mt-0.5">
                        Changed priority from No priority to{" "}
                        {currentTask.priority}.
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[8px] text-purple-600 shrink-0">
                      A
                    </div>

                    <div>

                      <p className="text-[8px] font-medium text-gray-800">
                        You
                      </p>

                      <p className="text-[8px] text-gray-500 mt-0.5">
                        posted an update · Aug 2026
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>

    </main>
  );
}


/* Property pill */
function PropertyPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const valueStyle =
    label === "Status"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : label === "Priority"
      ? value === "High"
        ? "bg-red-50 text-red-600 border-red-100"
        : value === "Medium"
        ? "bg-orange-50 text-orange-600 border-orange-100"
        : "bg-gray-100 text-gray-600 border-gray-200"
      : label === "Members"
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : label === "Date"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-black">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-1 text-[10px] font-medium ${valueStyle}`}
      >
        {label === "Date" && <CalendarDays size={10} />}
        {value}
      </span>
    </div>
  );
}


/* Subtask row */
function SubtaskRow({
  title,
  priority,
  member,
  date,
}: {
  title: string;
  priority: string;
  member: string;
  date: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_75px_90px_95px_25px] px-3 py-2.5 border-b border-gray-200 items-center">

      <span className="text-[8px] text-gray-700">
        {title}
      </span>

      <span
        className={`text-[8px] ${
          priority === "High"
            ? "text-red-500"
            : priority === "Medium"
            ? "text-orange-500"
            : "text-gray-500"
        }`}
      >
        {priority}
      </span>

      <span className="text-[8px] text-gray-600">
        {member}
      </span>

      <span className="flex items-center gap-1 text-[8px] text-gray-500">
        <CalendarDays size={9} />
        {date}
      </span>

      <button className="text-gray-400 hover:text-black">
        <MoreHorizontal size={11} />
      </button>

    </div>
  );
}


/* Editable details panel */
function EditableDetails({
  task,
  locked,
  onSave,
}: {
  task: (typeof tasks)[number];
  locked: boolean;
  onSave: (updatedTask: (typeof tasks)[number]) => void;
}) {
  const [openField, setOpenField] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);

  const [values, setValues] = useState({
    Status: task.status,
    Priority: task.priority,
    Members: task.member,
    Dates: task.dueDate,
    Labels: task.labels,
    Teams: task.team,
    Reporter: task.member,
  });

  useEffect(() => {
    setValues({
      Status: task.status,
      Priority: task.priority,
      Members: task.member,
      Dates: task.dueDate,
      Labels: task.labels,
      Teams: task.team,
      Reporter: task.member,
    });
    setDirty(false);
  }, [task]);

  /* Close any open editor when clicking outside the Details panel. */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpenField(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const options: Record<string, string[]> = {
    Status: ["To Do", "Doing", "Completed", "On Hold"],
    Priority: ["No Priority", "Urgent", "High", "Medium", "Low"],
    Members: ["Admin", "Designer", "Developer", "QA Team", "Security", "CN"],
    Dates: [
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "01 Aug",
      "02 Aug",
      "03 Aug",
    ],
    Labels: [
      "Research",
      "Development",
      "Design",
      "Testing",
      "Deployment",
      "Review",
      "Audit",
    ],
    Teams: ["Development", "Design", "Testing", "Security", "Research"],
    Reporter: ["Admin", "Designer", "Developer", "QA Team", "Security", "CN"],
  };

  const singleFields = [
    ["Status", values.Status],
    ["Priority", values.Priority],
    ["Members", values.Members],
    ["Dates", values.Dates],
    ["Teams", values.Teams],
    ["Reporter", values.Reporter],
  ] as const;

  const updateSingleValue = (label: string, value: string) => {
    if (locked) return;

    setValues((current) => ({ ...current, [label]: value }));
    setDirty(true);
    setOpenField(null);
  };

  const toggleLabel = (label: string) => {
    if (locked) return;

    setValues((current) => ({
      ...current,
      Labels: current.Labels.includes(label)
        ? current.Labels.filter((item) => item !== label)
        : [...current.Labels, label],
    }));
    setDirty(true);
  };

  const saveChanges = () => {
    if (locked) return;

    const stored = localStorage.getItem("ablespace-tasks");
    let storedTasks: Array<(typeof tasks)[number]> = tasks;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          storedTasks = parsed;
        }
      } catch {
        storedTasks = tasks;
      }
    }

    const updatedTask = {
      ...task,
      status: values.Status,
      priority: values.Priority,
      member: values.Members,
      dueDate: values.Dates,
      labels: values.Labels,
      team: values.Teams,
      reporter: values.Reporter,
    } as (typeof tasks)[number];

    const updatedTasks = storedTasks.map((item) =>
      item.id === task.id ? updatedTask : item
    );

    localStorage.setItem("ablespace-tasks", JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event("ablespace-tasks-updated"));

    onSave(updatedTask);
    setDirty(false);
    setOpenField(null);
  };

  const cancelChanges = () => {
    setValues({
      Status: task.status,
      Priority: task.priority,
      Members: task.member,
      Dates: task.dueDate,
      Labels: task.labels,
      Teams: task.team,
      Reporter: task.member,
    });
    setDirty(false);
    setOpenField(null);
  };

  return (
    <div ref={panelRef} className="border border-gray-200 rounded-md overflow-visible bg-white">
      <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-semibold text-gray-900">
            Details
          </h2>
          {locked && (
            <span
              title="This task is locked and cannot be edited"
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[8px] text-gray-500"
            >
              Locked
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {dirty && (
            <>
              <button
                type="button"
                onClick={cancelChanges}
                disabled={locked}
                className="h-6 rounded-md border border-gray-200 bg-white px-2 text-[8px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={locked}
                className="h-6 rounded-md bg-black px-2.5 text-[8px] font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </>
          )}

          <button type="button" className="text-gray-400 hover:text-black">
            <Plus size={12} />
          </button>
          <button type="button" className="text-gray-400 hover:text-black">
            <Settings size={11} />
          </button>
        </div>
      </div>

      {locked && (
        <div className="mx-3 mt-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
          <p className="text-[9px] font-medium text-gray-700">
            Cannot edit
          </p>
          <p className="mt-0.5 text-[8px] text-gray-500">
            This task is locked. Unlock the task to edit the details.
          </p>
        </div>
      )}

      <div className="px-3">
        {singleFields.map(([label, value]) =>
          label === "Dates" ? (
            <EditableDateRow
              key={label}
              label={label}
              value={value}
              locked={locked}
              onChange={(nextValue) => updateSingleValue(label, nextValue)}
            />
          ) : (
            <EditableDetailRow
              key={label}
              label={label}
              value={value}
              options={options[label]}
              locked={locked}
              open={openField === label}
              onToggle={() =>
                setOpenField((current) => (current === label ? null : label))
              }
              onChange={(nextValue) => updateSingleValue(label, nextValue)}
            />
          )
        )}

        <EditableLabelsRow
          labels={values.Labels}
          options={options.Labels}
          open={openField === "Labels"}
          onToggle={() =>
            setOpenField((current) =>
              current === "Labels" ? null : "Labels"
            )
          }
          onToggleLabel={toggleLabel}
        />
      </div>
    </div>
  );
}

function EditableDateRow({
  label,
  value,
  locked,
  onChange,
}: {
  label: string;
  value: string;
  locked: boolean;
  onChange: (value: string) => void;
}) {
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const toInputDate = (dateValue: string) => {
    const match = dateValue.match(/^(\d{1,2}) ([A-Za-z]{3})$/);

    if (!match) return "";

    const day = String(Number(match[1])).padStart(2, "0");
    const month = monthMap[match[2]];

    if (!month) return "";

    return `2026-${month}-${day}`;
  };

  const fromInputDate = (dateValue: string) => {
    if (!dateValue) return "";

    const [, month, day] = dateValue.split("-");

    return `${Number(day)} ${monthNames[Number(month) - 1]}`;
  };

  return (
    <div className="py-3 border-b border-gray-200">
      <p className="text-[9px] font-medium text-black mb-1.5">
        {label}
      </p>

      <label className="relative inline-flex items-center cursor-pointer">
        <CalendarDays
          size={10}
          className="absolute left-2.5 text-gray-500 pointer-events-none"
        />

        <input
          type="date"
          value={toInputDate(value)}
          onChange={(event) => onChange(fromInputDate(event.target.value))}
          disabled={locked}
           title={locked ? "Cannot edit: task is locked" : "Select due date"}
           className="h-7 w-[120px] cursor-pointer rounded-md border border-gray-200 bg-gray-50 pl-7 pr-2 text-[9px] font-medium text-gray-700 outline-none transition hover:bg-gray-100 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
    </div>
  );
}

function EditableDetailRow({
  label,
  value,
  options,
  locked,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  locked: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const valueStyle = getDetailValueStyle(label, value);

  return (
    <div className="relative py-3 border-b border-gray-200">
      <p className="text-[9px] font-medium text-black mb-1.5">
        {label}
      </p>

      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex max-w-full items-center gap-1 rounded-md border px-2.5 py-1 text-[9px] font-medium transition ${valueStyle} hover:shadow-sm`}
      >
        {label === "Dates" && <CalendarDays size={10} />}
        {value}
        <ChevronDown
          size={9}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[58px] z-50 w-[165px] rounded-md border border-gray-200 bg-white p-1.5 shadow-lg">
          <p className="px-2 py-1.5 text-[8px] font-medium text-gray-400">
            Edit {label}
          </p>

          <div className="max-h-[180px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={locked}
                onClick={() => onChange(option)}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[9px] transition ${
                  option === value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{option}</span>
                {option === value && <span className="text-black">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EditableLabelsRow({
  labels,
  options,
  open,
  locked,
  onToggle,
  onToggleLabel,
}: {
  labels: string[];
  options: string[];
  open: boolean;
  locked: boolean;
  onToggle: () => void;
  onToggleLabel: (label: string) => void;
}) {
  return (
    <div className="relative py-3">
      <p className="text-[9px] font-medium text-black mb-1.5">Labels</p>

      <button
        type="button"
        onClick={onToggle}
        className="inline-flex max-w-full items-center gap-1 rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-[9px] font-medium text-gray-700 hover:shadow-sm"
      >
        {labels.length > 0 ? labels.join(", ") : "No labels"}
        <ChevronDown
          size={9}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[58px] z-50 w-[165px] rounded-md border border-gray-200 bg-white p-1.5 shadow-lg">
          <p className="px-2 py-1.5 text-[8px] font-medium text-gray-400">
            Edit Labels
          </p>

          <div className="max-h-[180px] overflow-y-auto">
            {options.map((option) => {
              const selected = labels.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggleLabel(option)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[9px] transition ${
                    selected
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>{option}</span>
                  <span
                    className={`flex h-3 w-3 items-center justify-center rounded border text-[8px] ${
                      selected
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getDetailValueStyle(label: string, value: string) {
  if (label === "Status") {
    if (value === "Completed") return "bg-green-50 text-green-700 border-green-100";
    if (value === "Doing") return "bg-blue-50 text-blue-700 border-blue-100";
    if (value === "On Hold") return "bg-orange-50 text-orange-700 border-orange-100";
    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  if (label === "Priority") {
    if (value === "Urgent") return "bg-red-50 text-red-600 border-red-100";
    if (value === "High") return "bg-red-50 text-red-600 border-red-100";
    if (value === "Medium") return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-gray-100 text-gray-600 border-gray-200";
  }

  if (label === "Members" || label === "Reporter") {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }

  if (label === "Dates") {
    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  if (label === "Teams") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  return "bg-gray-100 text-gray-700 border-gray-200";
}
