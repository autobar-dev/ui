"use client";

import UserSection from "@/components/sections/user";
import { useParams } from "next/navigation";

export default function User() {
  const params = useParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email || "";

  return (
    <UserSection
      email={email}
    />
  );
}
