"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, Bookmark, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session?.user as { id?: string; name?: string; isAdmin?: boolean } | undefined;

  const navLinks = [
    { href: "/feed", label: "Feed" },
    { href: "/topics", label: "Topics" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-6 w-1.5 rounded-full bg-blue-500" />
            <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <div className="h-6 w-1.5 rounded-full bg-red-500" />
          </div>
          <span className="text-lg font-bold">CommonGround</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <User className="h-4 w-4" />
                {user?.name?.split(" ")[0] || "Account"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-md border bg-white py-1 shadow-lg">
                  <Link
                    href="/bookmarks"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Bookmark className="h-4 w-4" />Bookmarks
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />Settings
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/bookmarks" onClick={() => setMobileOpen(false)} className="text-base font-medium text-gray-700">
                  Bookmarks
                </Link>
                <Link href="/settings" onClick={() => setMobileOpen(false)} className="text-base font-medium text-gray-700">
                  Settings
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-base font-medium text-gray-700">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="mt-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md border px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
