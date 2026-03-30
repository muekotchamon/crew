import SignSessionClient from "./SignSessionClient";

export default function SignPage() {
  return (
    <main className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h4 fw-semibold mb-2" style={{ color: "var(--scr-slate-900)" }}>
        Sign online
      </h1>
      <p className="text-secondary small mb-4">
        In-app signing (demo). Document PDFs use the Sign online control in the preview modal on the main
        report page.
      </p>
      <SignSessionClient />
    </main>
  );
}
