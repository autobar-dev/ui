"use client";

import Logo from "../molecules/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext } from "react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

export default function Header() {
  const { logout } = useAuth();
  const { authRepository } = useContext(RepositoriesContext);

  return (
    <header className="bg-white w-full h-20 fixed left-0 top-0 border-b border-slate-100 flex items-center justify-between z-50 px-8 shadow-sm">
      <Logo withTextClassName="h-10" />

      <button
        onClick={() => logout(authRepository)}
        className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer whitespace-nowrap"
      >
        <HiArrowRightOnRectangle className="text-xl" />
        <span>Log out</span>
      </button>
    </header>
  );
}
