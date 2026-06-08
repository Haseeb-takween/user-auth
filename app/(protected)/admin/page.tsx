import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminLogoutButton from "./AdminLogoutButton";

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let admin: TokenPayload | null = null;
  try {
    admin = jwt.verify(token ?? "", process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    redirect("/admin/login");
  }

  if (admin?.role !== "admin") redirect("/dashboard");

  await connectDB();

  const mapUser = (d: any): UserRecord => ({
    _id: d._id.toString(),
    name: d.name,
    email: d.email,
    password: d.password,
    role: d.role ?? "user",
    createdAt: d.createdAt?.toISOString() ?? "",
  });

  const [users, totalAdmins] = await Promise.all([
    User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .lean()
      .then((docs) => docs.map(mapUser)),
    User.countDocuments({ role: "admin" }),
  ]);

  const totalUsers = users.length;
  const latest = users[0];

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Top bar */}
        <div
          className="relative mb-6 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0d0d0d] px-7 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ animation: "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="absolute -top-px left-[10%] right-[10%] h-px rounded-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/[0.07]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-500/70">Admin Portal</p>
              <h1 className="text-lg font-semibold tracking-tight text-[#e2e2e2]">User Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-[11px] text-[#525252]">Signed in as</p>
              <p className="text-sm font-medium text-[#e2e2e2]">{admin.name}</p>
            </div>
            <AdminLogoutButton />
          </div>
        </div>

        {/* Stats */}
        <div
          className="mb-6 grid grid-cols-3 gap-3"
          style={{ animation: "fade-up 0.4s 0.08s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="rounded-xl border border-white/[0.05] bg-[#0d0d0d] px-5 py-4">
            <p className="text-[11px] uppercase tracking-widest text-[#525252]">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-[#e2e2e2]">{totalUsers}</p>
          </div>
          <div className="rounded-xl border border-white/[0.05] bg-[#0d0d0d] px-5 py-4">
            <p className="text-[11px] uppercase tracking-widest text-[#525252]">Total Admins</p>
            <p className="mt-2 text-3xl font-semibold text-amber-400">{totalAdmins}</p>
          </div>
          <div className="rounded-xl border border-white/[0.05] bg-[#0d0d0d] px-5 py-4">
            <p className="text-[11px] uppercase tracking-widest text-[#525252]">Latest Join</p>
            <p className="mt-2 truncate text-sm font-medium text-[#e2e2e2]">
              {latest ? latest.name : "—"}
            </p>
            <p className="mt-0.5 text-[11px] text-[#525252]">
              {latest
                ? new Date(latest.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : ""}
            </p>
          </div>
        </div>

        {/* Users table */}
        <div
          className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{ animation: "fade-up 0.4s 0.14s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="border-b border-white/[0.05] px-7 py-4">
            <p className="text-sm font-medium text-[#e2e2e2]">
              Registered Users
              <span className="ml-2 rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-[#525252]">
                {users.length}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["#", "Name", "Email", "Hashed Password", "Role", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-[#3a3a3a]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/[0.03] transition-colors duration-150 hover:bg-white/[0.02]"
                  >
                    {/* # */}
                    <td className="px-6 py-4 text-[#3a3a3a]">{i + 1}</td>

                    {/* Name */}
                    <td className="px-6 py-4 font-medium text-[#e2e2e2]">{user.name}</td>

                    {/* Email */}
                    <td className="px-6 py-4 text-[#888]">{user.email}</td>

                    {/* Password hash */}
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-amber-500/[0.06] px-2.5 py-1 font-mono text-[11px] text-amber-500/70">
                        {user.password.slice(0, 30)}…
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                          admin
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-[#555]">
                          user
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-[#525252]">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#3a3a3a]">
                      No users registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
