"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#0d0d0d] px-9 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.02)_inset]"
      style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* Gradient top-border accent */}
      <div className="absolute -top-px left-[15%] right-[15%] h-px rounded-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Brand mark */}
      <div className="mb-8 flex flex-col items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/[0.06]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight text-[#e2e2e2]">
            Welcome back
          </h1>
          <p className="mt-1 text-[13px] text-[#4a4a4a]">
            Sign in to your account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3.5 py-2.5 text-[13px] text-red-400">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[11px] font-medium uppercase tracking-widest text-[#525252]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/[0.07] bg-[#111] px-3.5 py-2.5 text-sm text-[#e2e2e2] placeholder-[#2a2a2a] outline-none transition-all duration-200 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-[11px] font-medium uppercase tracking-widest text-[#525252]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/[0.07] bg-[#111] px-3.5 py-2.5 text-sm text-[#e2e2e2] placeholder-[#2a2a2a] outline-none transition-all duration-200 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-[13.5px] font-semibold text-black transition-all duration-200 hover:bg-amber-400 hover:shadow-[0_0_24px_rgba(245,158,11,0.28)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          )}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[#4a4a4a]">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-amber-500 transition-colors hover:text-amber-400"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
