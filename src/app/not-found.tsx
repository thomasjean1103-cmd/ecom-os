import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-100">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-zinc-400">Page introuvable.</p>
      <Link
        href="/"
        className="rounded-md bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
      >
        Retour au Centre de commandement
      </Link>
    </div>
  );
}
