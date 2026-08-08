import { tasks } from "@/data/tasks";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Paperclip,
  Plus,
} from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskDetailsPage({ params }: Props) {
  const { id } = await params;

  // Find the task using the ID from the URL
  const task = tasks.find((item) => item.id === id);

  // Show message if task does not exist
  if (!task) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
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

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-black"
          >
            <ArrowLeft size={14} />
            Back to Tasks
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <p className="text-[10px] text-gray-400 mb-2">
            Task ID: {task.id}
          </p>

          <h1 className="text-2xl font-semibold text-gray-900">
            {task.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            {task.description}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Main content */}
          <section>
            {/* Properties */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Properties
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Property
                  label="Status"
                  value={task.status}
                />

                <Property
                  label="Priority"
                  value={task.priority}
                />

                <Property
                  label="Members"
                  value={task.member}
                />

                <Property
                  label="Date"
                  value={task.dueDate}
                />

                <Property
                  label="Labels"
                  value={task.labels.join(", ")}
                />

                <Property
                  label="Team"
                  value={task.team}
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="border border-gray-200 rounded-lg mt-5">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Subtasks
                </h2>

                <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-black">
                  <Plus size={13} />
                  Add Subtasks
                </button>
              </div>

              <div>
                <Subtask
                  title="Subtask 1"
                  priority="High"
                  member="Admin"
                  date="12 Sep 2026"
                />

                <Subtask
                  title="Subtask 2"
                  priority="Low"
                  member="CN"
                  date="15 Sep 2026"
                />

                <Subtask
                  title="Subtask 3"
                  priority="Medium"
                  member="+"
                  date="18 Sep 2026"
                />
              </div>
            </div>

            {/* Comments */}
            <div className="border border-gray-200 rounded-lg mt-5 p-5">
              <h2 className="text-sm font-semibold mb-4 text-gray-900">
                Comments
              </h2>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-500 shrink-0" />

                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {task.member}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Documentation is currently being reviewed.
                  </p>
                </div>
              </div>

              <div className="mt-5 border border-gray-200 rounded-md p-3">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full h-16 resize-none outline-none text-xs"
                />

                <div className="flex justify-end">
                  <button className="text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800">
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right panel */}
          <aside className="border border-gray-200 rounded-lg p-5 h-fit">
            <h2 className="text-sm font-semibold mb-5 text-gray-900">
              Details
            </h2>

            <DetailRow
              label="Status"
              value={task.status}
            />

            <DetailRow
              label="Priority"
              value={task.priority}
            />

            <DetailRow
              label="Members"
              value={task.member}
            />

            <DetailRow
              label="Due Date"
              value={task.dueDate}
            />

            <DetailRow
              label="Labels"
              value={task.labels.join(", ")}
            />

            <div className="mt-6 pt-5 border-t border-gray-200">
              <h3 className="text-xs font-semibold mb-3 text-gray-900">
                Resources
              </h3>

              <button className="text-xs text-gray-500 flex items-center gap-2 hover:text-gray-900">
                <Paperclip size={13} />
                Add document or link...
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200">
              <h3 className="text-xs font-semibold mb-3 text-gray-900">
                Activity
              </h3>

              <p className="text-[10px] text-gray-500">
                Task created recently
              </p>

              <p className="text-[10px] text-gray-500 mt-2">
                Priority changed to {task.priority}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* Property component */
function Property({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="text-xs text-gray-700 mt-1">
        {value}
      </p>
    </div>
  );
}

/* Subtask component */
function Subtask({
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
    <div className="grid grid-cols-[1fr_120px_120px_150px] items-center px-5 py-3 border-b border-gray-200 last:border-b-0">
      <p className="text-xs text-gray-700">
        {title}
      </p>

      <span className="text-xs text-gray-500">
        {priority}
      </span>

      <span className="text-xs text-gray-500">
        {member}
      </span>

      <span className="flex items-center gap-1 text-[10px] text-gray-500">
        <CalendarDays size={11} />
        {date}
      </span>
    </div>
  );
}

/* Right-side detail component */
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="text-xs text-gray-700 mt-1">
        {value}
      </p>
    </div>
  );
}