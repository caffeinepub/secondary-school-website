import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useActor } from "../hooks/useActor";
import { Link } from "../lib/router-shim";
import { formatDate, sampleNews, sampleNotices } from "../lib/sampleData";

const DOT_POSITIONS = [
  { id: "d1", w: 12, h: 12, top: 4, left: 6, anim: 0, delay: 0 },
  { id: "d2", w: 22, h: 22, top: 41, left: 59, anim: 1, delay: 0.3 },
  { id: "d3", w: 32, h: 32, top: 78, left: 12, anim: 2, delay: 0.6 },
  { id: "d4", w: 42, h: 42, top: 15, left: 85, anim: 3, delay: 0.9 },
  { id: "d5", w: 52, h: 52, top: 55, left: 32, anim: 0, delay: 1.2 },
  { id: "d6", w: 12, h: 12, top: 90, left: 70, anim: 1, delay: 1.5 },
  { id: "d7", w: 22, h: 22, top: 30, left: 47, anim: 2, delay: 1.8 },
  { id: "d8", w: 32, h: 32, top: 68, left: 90, anim: 3, delay: 2.1 },
  { id: "d9", w: 42, h: 42, top: 8, left: 25, anim: 0, delay: 2.4 },
  { id: "d10", w: 52, h: 52, top: 47, left: 78, anim: 1, delay: 2.7 },
  { id: "d11", w: 12, h: 12, top: 85, left: 45, anim: 2, delay: 3.0 },
  { id: "d12", w: 22, h: 22, top: 22, left: 68, anim: 3, delay: 3.3 },
  { id: "d13", w: 32, h: 32, top: 60, left: 5, anim: 0, delay: 3.6 },
  { id: "d14", w: 42, h: 42, top: 3, left: 42, anim: 1, delay: 3.9 },
  { id: "d15", w: 52, h: 52, top: 35, left: 15, anim: 2, delay: 4.2 },
  { id: "d16", w: 12, h: 12, top: 73, left: 57, anim: 3, delay: 4.5 },
  { id: "d17", w: 22, h: 22, top: 18, left: 93, anim: 0, delay: 4.8 },
  { id: "d18", w: 32, h: 32, top: 50, left: 50, anim: 1, delay: 5.1 },
];

// Count-up hook
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({
  value,
  label,
  icon: Icon,
  isNumeric,
  numericValue,
  suffix,
  animate,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  isNumeric: boolean;
  numericValue: number;
  suffix: string;
  animate: boolean;
}) {
  const count = useCountUp(numericValue, 1800, animate);
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1">
        <Icon className="w-6 h-6 text-blue-200" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white">
        {isNumeric && animate ? `${count}${suffix}` : value}
      </div>
      <div className="text-sm text-blue-300 tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { actor } = useActor();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const { data: notices = [] } = useQuery({
    queryKey: ["publishedNotices"],
    queryFn: () => actor!.getPublishedNotices(),
    enabled: !!actor,
  });

  const { data: news = [] } = useQuery({
    queryKey: ["publishedNews"],
    queryFn: () => actor!.getPublishedNewsEvents(),
    enabled: !!actor,
  });

  const { data: principalMsg } = useQuery({
    queryKey: ["principalMsg"],
    queryFn: () => actor!.getPrincipalMessage(),
    enabled: !!actor,
  });

  // IntersectionObserver for stats count-up
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const displayNotices =
    notices.length > 0 ? notices.slice(0, 6) : sampleNotices;
  const displayNews = news.length > 0 ? news.slice(0, 5) : sampleNews;

  const principal = principalMsg ?? {
    principalName: "Mr. Ram Prasad Sharma",
    message:
      "Welcome to Buddha Deep English Boarding School, where we blend the timeless wisdom of Buddha with modern education. Our dedicated faculty and nurturing environment help every student achieve their full potential. We believe in holistic development \u2014 academic excellence, moral values, and personal growth.",
    blobId: undefined,
  };

  const stats = [
    {
      value: "2001",
      label: "Year Founded",
      icon: Trophy,
      isNumeric: true,
      numericValue: 2001,
      suffix: "",
    },
    {
      value: "1200+",
      label: "Students",
      icon: Users,
      isNumeric: true,
      numericValue: 1200,
      suffix: "+",
    },
    {
      value: "60+",
      label: "Teachers",
      icon: GraduationCap,
      isNumeric: true,
      numericValue: 60,
      suffix: "+",
    },
    {
      value: "Grade 1\u201312",
      label: "Classes Offered",
      icon: BookOpen,
      isNumeric: false,
      numericValue: 0,
      suffix: "",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[580px] flex items-center justify-center text-white overflow-hidden hero-shimmer">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {DOT_POSITIONS.map((dot) => (
            <span
              key={dot.id}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${dot.w}px`,
                height: `${dot.h}px`,
                top: `${dot.top}%`,
                left: `${dot.left}%`,
                animation: `pulse ${3 + dot.anim}s ease-in-out ${dot.delay}s infinite alternate`,
              }}
            />
          ))}
          <svg
            className="absolute right-12 top-12 opacity-[0.08] w-72 h-72"
            viewBox="0 0 200 200"
            fill="white"
            aria-hidden="true"
          >
            <title>Decorative lotus</title>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
              <ellipse
                key={rot}
                cx="100"
                cy="120"
                rx="20"
                ry="60"
                transform={`rotate(${rot} 100 100)`}
              />
            ))}
            <circle cx="100" cy="100" r="15" />
          </svg>
        </div>

        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <Badge className="mb-5 bg-white/20 text-white border-white/30 text-xs uppercase tracking-widest px-4 py-1.5">
            Established 2001 &bull; Lumbini Zone, Nepal
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight">
            Buddha Deep
            <br />
            <span className="text-cyan-300">English Boarding</span>
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-3 font-light">
            Enlightening Minds, Shaping Futures
          </p>
          <p className="text-blue-200/70 text-sm mb-10 max-w-xl mx-auto">
            A premier institution committed to academic excellence and holistic
            development in Butwal, Nepal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/about">
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-900 hover:bg-cyan-50 font-bold px-8 shadow-xl hover:shadow-2xl transition-all"
              >
                Explore Our School
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white/60 text-white hover:bg-white/15 px-8 backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NOTICE TICKER */}
      <div className="bg-amber-50 border-y border-amber-200 flex items-stretch overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white flex-shrink-0 z-10">
          <Bell className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-widest whitespace-nowrap">
            NOTICE
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee py-3">
            <span className="flex items-center gap-0">
              {displayNotices.map((notice, i) => (
                <span
                  key={`a-${notice.id.toString()}`}
                  className="flex items-center gap-3 mx-6"
                >
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                    {notice.title}
                  </span>
                  {i < displayNotices.length - 1 && (
                    <span className="text-amber-400 font-bold">&bull;</span>
                  )}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-0">
              {displayNotices.map((notice, i) => (
                <span
                  key={`b-${notice.id.toString()}`}
                  className="flex items-center gap-3 mx-6"
                >
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                    {notice.title}
                  </span>
                  {i < displayNotices.length - 1 && (
                    <span className="text-amber-400 font-bold">&bull;</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
        <Link
          to="/notices"
          className="flex items-center gap-1 px-4 py-3 text-red-600 font-semibold text-sm hover:text-red-800 transition-colors flex-shrink-0 border-l border-amber-200 bg-amber-50 whitespace-nowrap"
          data-ocid="notices.link"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* QUICK LINKS */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          {[
            {
              icon: Trophy,
              label: "Check Results",
              to: "/results",
              color: "from-yellow-400 to-orange-400",
            },
            {
              icon: Bell,
              label: "View Notices",
              to: "/notices",
              color: "from-red-400 to-pink-500",
            },
            {
              icon: BookOpen,
              label: "Admissions",
              to: "/contact",
              color: "from-green-400 to-teal-400",
            },
            {
              icon: Calendar,
              label: "News & Events",
              to: "/news",
              color: "from-blue-400 to-cyan-400",
            },
          ].map(({ icon: Icon, label, to, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white transition-all px-5 py-3 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 border border-white/10"
              data-ocid="nav.link"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wide">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRINCIPAL WELCOME */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100">
            <span
              className="absolute top-4 left-8 text-[10rem] leading-none font-serif text-blue-100 select-none pointer-events-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <div className="relative grid md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-blue-300 to-teal-300 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white">
                  {principal.blobId ? (
                    <img
                      src={principal.blobId.getDirectURL()}
                      alt={principal.principalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-5xl font-extrabold">
                      {principal.principalName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
                  Message from the Principal
                </p>
                <h2 className="text-3xl font-extrabold text-blue-900 mb-1">
                  {principal.principalName}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded mb-5" />
                <blockquote className="text-gray-600 leading-relaxed text-base md:text-lg italic">
                  {principal.message}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS — horizontal scroll */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-1">
                Stay Updated
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">
                Latest News &amp; Events
              </h2>
              <div className="mt-2 w-14 h-1.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded" />
            </div>
            <Link
              to="/news"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold group"
              data-ocid="news.link"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {displayNews.map((item) => (
              <Card
                key={item.id.toString()}
                className="flex-shrink-0 min-w-[280px] md:min-w-[320px] snap-start overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-0 shadow-md"
              >
                <div className="h-44 bg-gradient-to-br from-blue-200 to-teal-200 flex items-center justify-center overflow-hidden relative">
                  {item.blobId ? (
                    <img
                      src={item.blobId.getDirectURL()}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="w-14 h-14 text-blue-400/60" />
                  )}
                  <div className="absolute bottom-3 left-3 bg-blue-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {formatDate(item.date)}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} animate={statsVisible} />
          ))}
        </div>
      </section>
    </div>
  );
}
