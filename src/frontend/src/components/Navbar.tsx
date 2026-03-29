import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "../lib/router-shim";
import { Button } from "./ui/button";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Notices", to: "/notices" },
  { label: "News & Events", to: "/news" },
  { label: "Results", to: "/results" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-blue-900 leading-tight text-sm">
              Buddha Deep English
            </div>
            <div className="text-xs text-blue-700">Boarding School</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) =>
            link.label === "Contact" ? (
              <Link
                key={link.to}
                to={link.to}
                className={`ml-1 px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-colors ${
                  location.pathname === link.to
                    ? "bg-blue-700 border-blue-700 text-white"
                    : "border-blue-600 text-blue-700 hover:bg-blue-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  location.pathname === link.to
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link to="/admin">
            <Button size="sm" className="ml-2 bg-blue-700 hover:bg-blue-800">
              Admin
            </Button>
          </Link>
        </nav>

        <button
          type="button"
          className="lg:hidden p-2 rounded text-gray-600 hover:text-blue-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t px-4 pb-4">
          {links.map((link) =>
            link.label === "Contact" ? (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm font-semibold rounded mt-2 border-2 text-center transition-colors ${
                  location.pathname === link.to
                    ? "bg-blue-700 border-blue-700 text-white"
                    : "border-blue-600 text-blue-700 hover:bg-blue-700 hover:text-white"
                }`}
              >
                📞 {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded mt-1 ${
                  location.pathname === link.to
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button
              size="sm"
              className="mt-2 w-full bg-blue-700 hover:bg-blue-800"
            >
              Admin Panel
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
