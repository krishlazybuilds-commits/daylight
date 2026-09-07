import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="notfound-screen">
      <div className="notfound-glow" />
      <div className="notfound-card">
        <span className="notfound-brand">
          <svg className="icon-sparkle" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
          </svg>
          daylight
        </span>
        <p className="notfound-code">404</p>
        <h1>This page wandered off.</h1>
        <p className="notfound-copy">
          Whatever you were looking for isn&apos;t here. Let&apos;s get you back to your list.
        </p>
        <Link href="/" className="notfound-button">
          Back to your tasks
        </Link>
      </div>
    </main>
  );
}
