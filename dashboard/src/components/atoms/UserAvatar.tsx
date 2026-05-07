"use client";

/**
 * UI module for rendering a role-aware user avatar button.
 */
import { type MouseEventHandler } from "react";

type UserAvatarProps = {
  /**
   * Initials to show inside the avatar button.
   */
  initials: string;
  /**
   * The user's role used to determine styling.
   */
  role: "admin" | "user";
  /**
   * Optional tooltip text for the avatar button.
   */
  title?: string;
  /**
   * Optional click handler for toggling menus.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Optional aria-expanded value for associated menus.
   */
  ariaExpanded?: boolean;
};

/**
 * Renders a circular avatar button with role-based styling and initials.
 */
export default function UserAvatar({
  initials,
  role,
  title,
  onClick,
  ariaExpanded,
}: UserAvatarProps) {
  const roleStyles =
    role === "admin"
      ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400 hover:bg-amber-200"
      : "bg-blue-100 text-blue-700 ring-2 ring-blue-300 hover:bg-blue-200";

  return (
    <button
      type="button"
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${roleStyles}`}
      title={title}
      aria-haspopup="menu"
      aria-expanded={ariaExpanded}
      onClick={onClick}
    >
      {initials}
    </button>
  );
}
