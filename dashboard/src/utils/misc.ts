/**
 * Utility helpers used across the dashboard UI.
 */
import { User } from "@/types/user";

/**
 * Formats a date into a human-readable timestamp string.
 */
export function formatDate(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const years = date.getFullYear();

  const hoursString = String(hours).padStart(2, "0");
  const minutesString = String(minutes).padStart(2, "0");
  const secondsString = String(seconds).padStart(2, "0");
  const daysString = String(days).padStart(2, "0");
  const monthsString = String(months).padStart(2, "0");
  const yearsString = String(years).padStart(4, "0");

  return `${hoursString}:${minutesString}:${secondsString} ${daysString}/${monthsString}/${yearsString}`;
}

/**
 * Formats a float with a fixed number of decimal places.
 */
export function formatFloat(value: number, decimalPlaces: number): string {
  return (Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces).toFixed(decimalPlaces);
}

/**
 * Returns uppercase initials for the given user, falling back to email.
 */
export function getInitials(user: User): string {
  const firstName = user.first_name.trim();
  const lastName = user.last_name.trim();
  const email = user.email.trim();

  if (firstName || lastName) {
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
    if (initials) {
      return initials;
    }
  }

  // Conservative fallback: use email initials if names are missing/empty.
  const emailInitials = email.slice(0, 2).toUpperCase();
  return emailInitials || "??";
}
