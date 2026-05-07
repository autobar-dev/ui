"use client";

/**
 * UI module for the user avatar dropdown menu.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

import UserAvatar from "@/components/atoms/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { type User } from "@/types/user";
import { type IsValidData } from "@/types/auth";
import { getInitials } from "@/utils/misc";

type UserMenuProps = {
  /**
   * The authenticated user to display in the menu.
   */
  user: User;
  /**
   * The role for styling and labeling.
   */
  role: IsValidData["rol"];
};

/**
 * Renders a user avatar button with a dropdown menu containing user info and actions.
 */
export default function UserMenu({ user, role }: UserMenuProps) {
  const { logout } = useAuth();
  const { authRepository } = useContext(RepositoriesContext);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const initials = getInitials(user);
  const roleLabel = role === "admin" ? "Admin" : "User";

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout(authRepository);
  };

  return (
    <div className="relative" ref={containerRef}>
      <UserAvatar
        initials={initials}
        role={role}
        title={fullName ? `${fullName} • ${roleLabel}` : `${user.email} • ${roleLabel}`}
        onClick={() => setIsOpen((prev) => !prev)}
        ariaExpanded={isOpen}
      />

      {isOpen && (
        <div
          className="absolute right-0 top-12 z-50 min-w-[220px] rounded-xl border border-slate-100 bg-white py-2 shadow-lg"
          role="menu"
        >
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-slate-800">
              {fullName || user.email}
            </p>
            {fullName && (
              <p className="text-xs text-slate-500">{user.email}</p>
            )}
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${role === "admin"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
                }`}
            >
              {roleLabel}
            </span>
          </div>

          <div className="my-2 border-t border-slate-100" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-500"
          >
            <HiArrowRightOnRectangle className="text-lg" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
