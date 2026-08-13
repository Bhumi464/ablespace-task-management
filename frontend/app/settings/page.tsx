"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Palette,
  Search,
  Sun,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const PROFILE_KEY = "ablespace-profile";
const THEME_KEY = "ablespace-theme";
const COLOR_KEY = "ablespace-color-mode";

type Theme = "light" | "dark";

type ColorMode =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black"
  | "purple";

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

const colors: Record<ColorMode, string> = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  pink: "#ec4899",
  rose: "#f43f5e",
  emerald: "#10b981",
  black: "#111111",
  purple: "#ac05fa",
};

const colorOptions: {
  key: ColorMode;
  label: string;
}[] = [
  { key: "amber", label: "Amber" },
  { key: "blue", label: "Blue" },
  { key: "pink", label: "Pink" },
  { key: "rose", label: "Rose" },
  { key: "emerald", label: "Emerald" },
  { key: "black", label: "Black" },
  { key: "purple", label: "Purple" },
];

function getSavedTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return localStorage.getItem(THEME_KEY) === "dark"
    ? "dark"
    : "light";
}

function getSavedColor(): ColorMode {
  if (typeof window === "undefined") {
    return "purple";
  }

  const value = localStorage.getItem(COLOR_KEY);

  if (
    value === "amber" ||
    value === "blue" ||
    value === "pink" ||
    value === "rose" ||
    value === "emerald" ||
    value === "black" ||
    value === "purple"
  ) {
    return value;
  }

  return "purple";
}

export default function SettingsPage() {
  const [profile, setProfile] =
    useState<Profile>(defaultProfile);

    const handleLeaveWorkspace = () => {
  // Clear login/session data
  localStorage.removeItem("ablespace-user");
  localStorage.removeItem("ablespace-auth");
  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");

  // Go to login page
  window.location.href = "/";
};
  const [theme, setTheme] =
    useState<Theme>("light");

  const [colorMode, setColorMode] =
    useState<ColorMode>("purple");

  const [openMenu, setOpenMenu] =
    useState<"theme" | "color" | null>(null);

  const [saved, setSaved] =
    useState(false);

  /* -----------------------------
     Load profile
  ----------------------------- */

  useEffect(() => {
    const savedProfile =
      localStorage.getItem(PROFILE_KEY);

    if (savedProfile) {
      try {
        setProfile({
          ...defaultProfile,
          ...JSON.parse(savedProfile),
        });
      } catch {
        setProfile(defaultProfile);
      }
    }
  }, []);

  /* -----------------------------
     Theme + Color synchronization
  ----------------------------- */

  useEffect(() => {
    const applyTheme = (nextTheme: Theme) => {
      setTheme(nextTheme);

      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const applyColor = (nextColor: ColorMode) => {
      setColorMode(nextColor);

      document.documentElement.style.setProperty(
        "--accent-color",
        colors[nextColor]
      );
    };

    applyTheme(getSavedTheme());
    applyColor(getSavedColor());

    const handleThemeUpdated = (event: Event) => {
      const customEvent =
        event as CustomEvent<Theme>;

      applyTheme(
        customEvent.detail === "dark"
          ? "dark"
          : "light"
      );
    };

    const handleColorUpdated = (event: Event) => {
      const customEvent =
        event as CustomEvent<ColorMode>;

      if (customEvent.detail in colors) {
        applyColor(customEvent.detail);
      }
    };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (event.key === THEME_KEY) {
        applyTheme(
          event.newValue === "dark"
            ? "dark"
            : "light"
        );
      }

      if (event.key === COLOR_KEY) {
        if (
          event.newValue &&
          event.newValue in colors
        ) {
          applyColor(
            event.newValue as ColorMode
          );
        }
      }
    };

    window.addEventListener(
      "ablespace-theme-updated",
      handleThemeUpdated
    );

    window.addEventListener(
      "ablespace-color-mode-updated",
      handleColorUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "ablespace-theme-updated",
        handleThemeUpdated
      );

      window.removeEventListener(
        "ablespace-color-mode-updated",
        handleColorUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* -----------------------------
     Change theme
  ----------------------------- */

  const changeTheme = (
    newTheme: Theme
  ) => {
    setTheme(newTheme);

    localStorage.setItem(
      THEME_KEY,
      newTheme
    );

    if (newTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }

    window.dispatchEvent(
      new CustomEvent<Theme>(
        "ablespace-theme-updated",
        {
          detail: newTheme,
        }
      )
    );

    setOpenMenu(null);
  };

  /* -----------------------------
     Change color
  ----------------------------- */

  const changeColorMode = (
    newColor: ColorMode
  ) => {
    setColorMode(newColor);

    localStorage.setItem(
      COLOR_KEY,
      newColor
    );

    document.documentElement.style.setProperty(
      "--accent-color",
      colors[newColor]
    );

    window.dispatchEvent(
      new CustomEvent<ColorMode>(
        "ablespace-color-mode-updated",
        {
          detail: newColor,
        }
      )
    );

    setOpenMenu(null);
  };

  /* -----------------------------
     Edit profile
  ----------------------------- */

  const handleChange = (
    field: keyof Profile,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  /* -----------------------------
     Save profile
  ----------------------------- */

  const handleSave = () => {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );

    window.dispatchEvent(
      new Event(
        "ablespace-profile-updated"
      )
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const isDark = theme === "dark";
  const accentColor = colors[colorMode];

  /* -----------------------------
     Styles
  ----------------------------- */

  const pageClass = isDark
    ? "bg-[#171717] text-white"
    : "bg-white text-[#111111]";

  const sidebarClass = isDark
    ? "bg-[#1C1C1C] border-[#333333]"
    : "bg-[#FAFAFA] border-[#E5E5E5]";

  const cardClass = isDark
    ? "bg-[#1F1F1F] border-[#333333]"
    : "bg-white border-[#E5E5E5]";

  const rowBorderClass = isDark
    ? "border-[#333333]"
    : "border-[#E5E5E5]";

  const inputClass = isDark
    ? "bg-[#292929] border-[#3A3A3A] text-white placeholder:text-[#777777]"
    : "bg-[#F7F7F7] border-[#E5E5E5] text-[#333333] placeholder:text-[#999999]";

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${pageClass}`}
    >
      <div className="flex min-h-screen">

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside
          className={`relative z-20 w-[155px] shrink-0 border-r ${sidebarClass}`}
        >

          {/* Back to app */}

          <div className="px-3 pt-3">
            <Link
              href="/tasks"
              className={`flex items-center gap-2 h-[30px] px-2 rounded-md text-[11px] ${
                isDark
                  ? "text-[#DDDDDD] hover:bg-[#292929]"
                  : "text-[#333333] hover:bg-[#F1F1F1]"
              }`}
            >
              <ArrowLeft
                size={12}
                strokeWidth={1.5}
              />

              <span>
                Back to app
              </span>
            </Link>
          </div>

          {/* Search */}

          <div className="px-3 mt-2">
            <div
              className={`h-[32px] rounded-md border flex items-center gap-2 px-2 ${
                isDark
                  ? "bg-[#222222] border-[#3A3A3A]"
                  : "bg-white border-[#E5E5E5]"
              }`}
            >
              <Search
                size={12}
                strokeWidth={1.5}
                className={
                  isDark
                    ? "text-[#999999]"
                    : "text-[#777777]"
                }
              />

              <input
                type="text"
                placeholder="Search"
                className={`w-full bg-transparent outline-none border-0 text-[10px] ${
                  isDark
                    ? "text-white placeholder:text-[#777777]"
                    : "text-[#333333] placeholder:text-[#999999]"
                }`}
              />
            </div>
          </div>

          {/* Navigation */}

          <nav className="px-3 mt-2 space-y-1">

            {/* Profile */}

            <Link
              href="/settings"
              className={`flex items-center gap-2 h-[32px] rounded-md px-2 text-[11px] font-medium ${
                isDark
                  ? "bg-[#292929] text-white"
                  : "bg-white text-[#111111]"
              }`}
            >
              <UserRound
                size={13}
                strokeWidth={1.5}
                className="shrink-0"
                style={{
                  color: accentColor,
                }}
              />

              <span>
                Profile
              </span>
            </Link>

            {/* Theme */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu === "theme"
                      ? null
                      : "theme"
                  )
                }
                className={`w-full flex items-center justify-between h-[32px] px-2 rounded-md text-[11px] ${
                  isDark
                    ? "text-[#DDDDDD] hover:bg-[#292929]"
                    : "text-[#333333] hover:bg-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun
                    size={12}
                    strokeWidth={1.5}
                  />

                  Theme
                </span>

                <ChevronRight
                  size={11}
                />
              </button>

              {openMenu === "theme" && (
                <div
                  className={`absolute left-[142px] top-0 z-[9999] w-[105px] rounded-md border py-1 shadow-lg ${
                    isDark
                      ? "bg-[#222222] border-[#3A3A3A] text-white"
                      : "bg-white border-[#E5E5E5] text-[#222222]"
                  }`}
                >
                  <p
                    className={`px-3 py-1.5 text-[9px] ${
                      isDark
                        ? "text-[#888888]"
                        : "text-[#777777]"
                    }`}
                  >
                    Theme
                  </p>

                  {/* Light */}

                  <button
                    type="button"
                    onClick={() =>
                      changeTheme("light")
                    }
                    className={`w-full h-[30px] px-3 flex items-center justify-between text-left text-[10px] ${
                      isDark
                        ? "hover:bg-[#333333]"
                        : "hover:bg-[#F5F5F5]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sun size={11} />

                      Light
                    </span>

                    {theme === "light" && (
                      <Check size={11} />
                    )}
                  </button>

                  {/* Dark */}

                  <button
                    type="button"
                    onClick={() =>
                      changeTheme("dark")
                    }
                    className={`w-full h-[30px] px-3 flex items-center justify-between text-left text-[10px] ${
                      isDark
                        ? "hover:bg-[#333333]"
                        : "hover:bg-[#F5F5F5]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[12px]">
                        ☾
                      </span>

                      Dark
                    </span>

                    {theme === "dark" && (
                      <Check size={11} />
                    )}
                  </button>
                </div>
              )}

            </div>

            {/* Color */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    openMenu === "color"
                      ? null
                      : "color"
                  )
                }
                className={`w-full flex items-center justify-between h-[32px] px-2 rounded-md text-[11px] ${
                  isDark
                    ? "text-[#DDDDDD] hover:bg-[#292929]"
                    : "text-[#333333] hover:bg-white"
                }`}
              >
                <span className="flex items-center gap-2">

                  <Palette
                    size={12}
                    strokeWidth={1.5}
                  />

                  Color
                </span>

                <ChevronRight
                  size={11}
                />
              </button>

              {openMenu === "color" && (
                <div
                  className={`absolute left-[140px] top-0 z-[9999] w-[120px] rounded-md border py-1 shadow-lg ${
                    isDark
                      ? "bg-[#222222] border-[#3A3A3A] text-white"
                      : "bg-white border-[#E5E5E5] text-[#222222]"
                  }`}
                >
                  <p
                    className={`px-3 py-1.5 text-[9px] ${
                      isDark
                        ? "text-[#888888]"
                        : "text-[#777777]"
                    }`}
                  >
                    Color Mode
                  </p>

                  {colorOptions.map(
                    (item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          changeColorMode(
                            item.key
                          )
                        }
                        className={`w-full h-[30px] px-3 flex items-center justify-between text-left text-[10px] ${
                          isDark
                            ? "hover:bg-[#333333]"
                            : "hover:bg-[#F5F5F5]"
                        }`}
                      >
                        <span className="flex items-center gap-2">

                          <span
                            className="w-[9px] h-[9px] rounded-[1px]"
                            style={{
                              backgroundColor:
                                colors[item.key],
                            }}
                          />

                          {item.label}
                        </span>

                        {colorMode ===
                          item.key && (
                          <Check
                            size={11}
                          />
                        )}
                      </button>
                    )
                  )}
                </div>
              )}

            </div>

          </nav>

        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="flex-1 min-w-0">

          <div className="max-w-[700px] mx-auto px-8 pt-[65px] pb-12">

            {/* Profile title */}

            <h1
              className={`text-[22px] font-medium mb-8 ${
                isDark
                  ? "text-white"
                  : "text-[#111111]"
              }`}
            >
              Profile
            </h1>

            {/* =====================
                PROFILE CARD
            ===================== */}

            <div
              className={`w-full border rounded-lg overflow-hidden ${cardClass}`}
            >

              {/* Profile picture */}

              <div
                className={`min-h-[88px] px-5 flex items-center justify-between border-b ${rowBorderClass}`}
              >
                <div>
                  <p
                    className={`text-[13px] font-medium ${
                      isDark
                        ? "text-white"
                        : "text-[#222222]"
                    }`}
                  >
                    Profile picture
                  </p>

                  <p
                    className={`text-[11px] mt-1 ${
                      isDark
                        ? "text-[#999999]"
                        : "text-[#888888]"
                    }`}
                  >
                    Your profile picture
                  </p>
                </div>

                <div
                  className="w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                >
                  <span className="text-[17px] font-semibold text-white">
                    D
                  </span>
                </div>
              </div>

              {/* Email */}

              <div
                className={`min-h-[88px] px-5 flex items-center justify-between border-b ${rowBorderClass}`}
              >
                <div>
                  <p
                    className={`text-[13px] font-medium ${
                      isDark
                        ? "text-white"
                        : "text-[#222222]"
                    }`}
                  >
                    Email
                  </p>

                  <p
                    className={`text-[11px] mt-1 ${
                      isDark
                        ? "text-[#999999]"
                        : "text-[#888888]"
                    }`}
                  >
                    Your account email address
                  </p>
                </div>

                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                  className={`w-[190px] h-[36px] px-3 rounded-md border outline-none text-[12px] focus:border-[#999999] ${inputClass}`}
                />
              </div>

              {/* Full name */}

              <div
                className={`min-h-[88px] px-5 flex items-center justify-between border-b ${rowBorderClass}`}
              >
                <div>
                  <p
                    className={`text-[13px] font-medium ${
                      isDark
                        ? "text-white"
                        : "text-[#222222]"
                    }`}
                  >
                    Full name
                  </p>

                  <p
                    className={`text-[11px] mt-1 ${
                      isDark
                        ? "text-[#999999]"
                        : "text-[#888888]"
                    }`}
                  >
                    Your display name
                  </p>
                </div>

                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    handleChange(
                      "fullName",
                      e.target.value
                    )
                  }
                  className={`w-[190px] h-[36px] px-3 rounded-md border outline-none text-[12px] focus:border-[#999999] ${inputClass}`}
                />
              </div>

              {/* Title */}

              <div
                className={`min-h-[88px] px-5 flex items-center justify-between border-b ${rowBorderClass}`}
              >
                <div>
                  <p
                    className={`text-[13px] font-medium ${
                      isDark
                        ? "text-white"
                        : "text-[#222222]"
                    }`}
                  >
                    Title
                  </p>

                  <p
                    className={`text-[11px] mt-1 ${
                      isDark
                        ? "text-[#999999]"
                        : "text-[#888888]"
                    }`}
                  >
                    Your job title or role
                  </p>
                </div>

                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }
                  className={`w-[190px] h-[36px] px-3 rounded-md border outline-none text-[12px] focus:border-[#999999] ${inputClass}`}
                />
              </div>

              {/* Username */}

              <div
                className={`min-h-[88px] px-5 flex items-center justify-between ${rowBorderClass}`}
              >
                <div>
                  <p
                    className={`text-[13px] font-medium ${
                      isDark
                        ? "text-white"
                        : "text-[#222222]"
                    }`}
                  >
                    Username
                  </p>

                  <p
                    className={`text-[11px] mt-1 ${
                      isDark
                        ? "text-[#999999]"
                        : "text-[#888888]"
                    }`}
                  >
                    One word, like a nickname or first name
                  </p>
                </div>

                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) =>
                    handleChange(
                      "username",
                      e.target.value
                    )
                  }
                  className={`w-[190px] h-[36px] px-3 rounded-md border outline-none text-[12px] focus:border-[#999999] ${inputClass}`}
                />
              </div>

            </div>

            {/* Save button */}

            <div className="flex items-center justify-end mt-5">

              {saved && (
                <span className="text-[11px] text-green-600 mr-3">
                  Changes saved
                </span>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="h-[36px] px-6 rounded-md text-white text-[12px] font-medium hover:opacity-90"
                style={{
                  backgroundColor:
                    accentColor,
                }}
              >
                Save Changes
              </button>

            </div>

            {/* =====================
                WORKSPACE ACCESS
            ===================== */}

            <div className="mt-10">

              <h2
                className={`text-[13px] font-medium mb-3 ${
                  isDark
                    ? "text-white"
                    : "text-[#222222]"
                }`}
              >
                Workspace access
              </h2>

              <div
                className={`w-full border rounded-lg px-5 py-5 flex items-center justify-between ${cardClass}`}
              >
                <p
                  className={`text-[11px] ${
                    isDark
                      ? "text-[#999999]"
                      : "text-[#777777]"
                  }`}
                >
                  Remove yourself from the workspace
                </p>

                <button
  type="button"
  onClick={handleLeaveWorkspace}
  className="h-[32px] px-4 rounded-md bg-[#FFF0F0] text-[#FF5A5A] text-[11px] font-medium hover:bg-[#FFE5E5]"
>
  Leave Workspace
</button>

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}