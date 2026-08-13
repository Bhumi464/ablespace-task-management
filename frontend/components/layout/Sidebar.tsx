"use client";

import Link from "next/link";
import {
  FolderKanban,
  ListTodo,
  ChevronDown,
  Sun,
  Moon,
  Settings,
  Palette,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [colorModeOpen, setColorModeOpen] = useState(false);
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("app-theme");

    if (saved === "Dark" || saved === "Light") {
      setTheme(saved);

      if (saved === "Dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Close only when the click is outside the profile button/menu.
  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileButtonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;

      setProfileOpen(false);
      setThemeOpen(false);
      setColorModeOpen(false);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [profileOpen]);

  const toggleProfile = () => {
    setProfileOpen((previous) => !previous);
    setThemeOpen(false);
    setColorModeOpen(false);
  };

  const changeTheme = (newTheme: "Light" | "Dark") => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);

    if (newTheme === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setThemeOpen(false);
  };

  return (
    <aside
  onClick={() => {
    alert("SIDEBAR CLICKED");
  }}
  className="relative z-[9999] w-[150px] min-h-screen border-r border-[#E5E5E5] bg-white"
>
      {/* Dexter / Profile */}
      <div className="relative h-[55px] border-b border-[#E5E5E5] px-3 flex items-center">
        <button
          ref={profileButtonRef}
          type="button"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={toggleProfile}
          className="w-full h-[34px] flex items-center justify-between px-1 rounded-md bg-white hover:bg-[#F5F5F5] cursor-pointer select-none"
        >
          <span className="flex items-center gap-2 pointer-events-none">
            <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-medium text-white">D</span>
            </span>

            <span className="text-[11px] font-semibold text-[#111111]">
              Dexter
            </span>
          </span>

          <ChevronDown
            size={11}
            strokeWidth={1.5}
            className="text-[#555555] pointer-events-none"
          />
        </button>

        {profileOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute left-[6px] top-[50px] z-[99999] w-[144px] rounded-md border border-[#E5E5E5] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Profile */}
            <div className="px-3 py-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-[12px] font-medium text-white">D</span>
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
                onClick={() => {
                  setThemeOpen((previous) => !previous);
                  setColorModeOpen(false);
                }}
                className="w-full h-[32px] px-3 flex items-center justify-between text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sun size={11} strokeWidth={1.7} />
                  Change Theme
                </span>
                <span>›</span>
              </button>

              {themeOpen && (
                <div className="absolute left-[140px] top-0 z-[100000] w-[105px] rounded-md border border-[#E5E5E5] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                  <p className="px-3 py-1 text-[8px] text-[#777777]">
                    Theme
                  </p>

                  <button
                    type="button"
                    onClick={() => changeTheme("Light")}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sun size={10} />
                      Light
                    </span>
                    {theme === "Light" && <span>✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => changeTheme("Dark")}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Moon size={10} />
                      Dark
                    </span>
                    {theme === "Dark" && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Color Mode */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setColorModeOpen((previous) => !previous);
                  setThemeOpen(false);
                }}
                className="w-full h-[32px] px-3 flex items-center justify-between text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Palette size={11} strokeWidth={1.7} />
                  Color Mode
                </span>
                <span>›</span>
              </button>

              {colorModeOpen && (
                <div className="absolute left-[140px] top-0 z-[100000] w-[105px] rounded-md border border-[#E5E5E5] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] py-1">
                  <p className="px-3 py-1 text-[8px] text-[#777777]">
                    Color Mode
                  </p>

                  <button
                    type="button"
                    className="w-full px-3 py-1.5 text-left text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    Default
                  </button>

                  <button
                    type="button"
                    className="w-full px-3 py-1.5 text-left text-[9px] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    Purple
                  </button>
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
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-[9px] font-medium text-[#777777]">
            Workspace
          </p>

          <ChevronDown
            size={11}
            strokeWidth={1.5}
            className="text-[#333333]"
          />
        </div>

        <nav className="space-y-1">
          <Link
            href="/tasks"
            className="flex h-[32px] items-center gap-2 rounded-md bg-[#F2F2F2] px-2 text-[10px] font-medium text-[#111111] cursor-pointer"
          >
            <ListTodo size={13} strokeWidth={1.5} />
            <span>Tasks</span>
          </Link>

          <Link
            href="/projects"
            className="flex h-[32px] items-center gap-2 rounded-md px-2 text-[10px] font-medium text-[#333333] hover:bg-[#F5F5F5] cursor-pointer"
          >
            <FolderKanban
              size={13}
              strokeWidth={1.5}
              className="text-[#555555]"
            />
            <span>Projects</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}