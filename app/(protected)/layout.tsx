export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>;
}
