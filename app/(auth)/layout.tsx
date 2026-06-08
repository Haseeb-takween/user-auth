export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-[#080808]">
      {/* Amber radial glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          className="h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.07) 0%, rgba(245,158,11,0.02) 45%, transparent 70%)",
            animation: "breathe 5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, #1c1c1c 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </main>
  );
}
