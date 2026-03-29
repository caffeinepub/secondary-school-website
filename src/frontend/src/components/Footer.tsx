import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "../lib/router-shim";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">Buddha Deep EBS</span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Enlightening Minds, Shaping Futures. Providing quality
            English-medium education since 2001.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
          <ul className="space-y-1">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Notices", to: "/notices" },
              { label: "Results", to: "/results" },
              { label: "Gallery", to: "/gallery" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Academics</h4>
          <ul className="space-y-1 text-blue-200 text-sm">
            <li>Grade 1 – Grade 8 (Basic)</li>
            <li>Grade 9 – Grade 10 (SEE)</li>
            <li>Grade 11 – Grade 12 (+2)</li>
            <li>NEB Affiliated</li>
            <li>English Medium</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Contact Info</h4>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              Buddha Deep, Lumbini Zone, Butwal, Nepal
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              +977-071-XXXXXX
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              info@buddhadeepebs.edu.np
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 text-center py-4 text-blue-300 text-sm">
        © {new Date().getFullYear()} Buddha Deep English Boarding School. All
        rights reserved.
      </div>
    </footer>
  );
}
