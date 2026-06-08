import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "./LogoutButton";

interface TokenPayload {
  id: string;
  role: "user" | "admin";
  name: string;
  email: string;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: TokenPayload | null = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch {
      user = null;
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div
          className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d0d] px-8 py-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Amber top line */}
          <div className="absolute -top-px left-[15%] right-[15%] h-px rounded-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/[0.08] text-base font-semibold text-amber-400">
              {initials}
            </div>

            {/* Name + email */}
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-[#525252]">
                Signed in as
              </p>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-[#e2e2e2]">
                {user?.name ?? "Unknown"}
              </h1>
              <p className="mt-0.5 truncate text-sm text-[#4a4a4a]">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-white/[0.04]" />

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.05] bg-[#111] px-4 py-3">
              <p className="text-[11px] uppercase tracking-widest text-[#525252]">
                Status
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-[#e2e2e2]">
                  Active
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-[#111] px-4 py-3">
              <p className="text-[11px] uppercase tracking-widest text-[#525252]">
                Session
              </p>
              <p className="mt-1.5 text-sm font-medium text-[#e2e2e2]">
                24 hours
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-5">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
