"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full rounded-lg border border-white/[0.06] bg-[#111] px-4 py-2.5 text-[13px] font-medium text-[#888] transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
