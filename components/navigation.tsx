"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
export type NavItem = { label: string; href: string };
export function Navigation({
  name,
  items,
}: {
  name: string;
  items: NavItem[];
}) {
  const [active, setActive] = useState(""),
    dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const motionTargets = document.querySelectorAll<HTMLElement>(
      ".public-site .editorial-section",
    );
    const motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            motionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    motionTargets.forEach((node) => motionObserver.observe(node));
    document.documentElement.classList.add("motion-ready");
    const nodes = items
      .map((item) =>
        item.href.startsWith("#")
          ? document.getElementById(item.href.slice(1))
          : null,
      )
      .filter((node): node is HTMLElement => !!node);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (entry) setActive("#" + entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      motionObserver.disconnect();
    };
  }, [items]);
  const close = () => {
    dialog.current?.close();
    trigger.current?.focus();
  };
  return (
    <header className="site-header">
      <div className="nav-rule">
        {/* Logo / wordmark — left side of pill */}
        <Link
          className="wordmark"
          href="/"
          aria-label={`${name || "Portofolio"} — beranda`}
        >
          {/* Sparkle icon — cosmic accent */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41" />
          </svg>
          {name || "Portofolio"}
        </Link>

        {/* Desktop nav links — center */}
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {items.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={active === item.href ? "active" : ""}
              aria-current={active === item.href ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger — right side */}
        <button
          ref={trigger}
          className="menu-button"
          onClick={() => dialog.current?.showModal()}
          aria-label="Buka menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile menu dialog */}
      <dialog
        ref={dialog}
        className="mobile-menu"
        onClose={() => trigger.current?.focus()}
      >
        <div className="dialog-heading">
          <span>Navigasi</span>
          <button onClick={close}>
            Tutup{" "}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>
        <nav aria-label="Navigasi mobile">
          {items.map((item) => (
            <Link key={item.href + item.label} href={item.href} onClick={close}>
              {item.label}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 13L13 3M5 3h8v8" />
              </svg>
            </Link>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
