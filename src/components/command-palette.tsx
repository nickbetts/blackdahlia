"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";

const routes = [
  { label: "Studio — Home", href: "/" },
  { label: "About the studio", href: "/about" },
  { label: "Artists", href: "/artists" },
  { label: "Book a session", href: "/booking" },
  { label: "FAQ", href: "/faq" },
  { label: "Studio policies", href: "/policies" },
  { label: "Find us / Visit", href: "/contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }

    function onTriggerClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-command-trigger='true']")) {
        e.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onTriggerClick);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onTriggerClick);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="cmdOverlay" onClick={() => setOpen(false)}>
      <div
        className="cmdDialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation palette"
      >
        <Command>
          <Command.Input className="cmdInput" placeholder="Where do you want to go?" autoFocus />
          <Command.List className="cmdList">
            <Command.Empty className="cmdEmpty">No results.</Command.Empty>
            <Command.Group heading="Pages" className="cmdGroup">
              {routes.map((r) => (
                <Command.Item
                  key={r.href}
                  className="cmdItem"
                  value={r.label}
                  onSelect={() => {
                    router.push(r.href);
                    setOpen(false);
                  }}
                >
                  {r.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
