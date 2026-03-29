import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  Check,
  Edit2,
  Eye,
  EyeOff,
  Image,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Plus,
  Settings,
  Shield,
  Trash2,
  Trophy,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  ContactMessage,
  GalleryItem,
  NewsEvent,
  Notice,
  StaffMember,
  StudentResult,
} from "../backend";
import { ExternalBlob } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatDate } from "../lib/sampleData";

type Tab =
  | "notices"
  | "news"
  | "results"
  | "gallery"
  | "staff"
  | "principal"
  | "schoolinfo"
  | "contacts";

// ======== PIN Screen ========
const DEFAULT_PIN = "1234";
const PIN_STORAGE_KEY = "adminPin";
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

function getStoredPin(): string {
  return localStorage.getItem(PIN_STORAGE_KEY) ?? DEFAULT_PIN;
}

function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [entered, setEntered] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
      } else {
        setCountdown(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  function press(digit: string) {
    if (lockedUntil) return;
    if (entered.length >= 4) return;
    const next = entered + digit;
    setEntered(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === getStoredPin()) {
          onUnlock();
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setShake(true);
          setTimeout(() => setShake(false), 600);
          setEntered("");
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
            setCountdown(LOCKOUT_SECONDS);
          }
        }
      }, 200);
    }
  }

  function backspace() {
    setEntered((prev) => prev.slice(0, -1));
  }

  const locked = !!lockedUntil;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Buddha Deep English Boarding School
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <p className="text-slate-300 text-sm text-center mb-6 font-medium">
            Enter your 4-digit PIN
          </p>

          <div
            className={`flex justify-center gap-4 mb-8 ${shake ? "animate-shake" : ""}`}
            data-ocid="pin.panel"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  i < entered.length
                    ? "bg-blue-400 border-blue-400 scale-110"
                    : "bg-transparent border-slate-500"
                }`}
              />
            ))}
          </div>

          {locked ? (
            <div className="text-center py-4">
              <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 text-sm font-medium">
                Too many attempts. Please wait {countdown}s.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => press(d)}
                  data-ocid="pin.button"
                  className="h-14 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-blue-600 text-white text-xl font-semibold transition-colors duration-100 select-none"
                >
                  {d}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => press("0")}
                data-ocid="pin.button"
                className="h-14 rounded-xl bg-slate-700 hover:bg-slate-600 active:bg-blue-600 text-white text-xl font-semibold transition-colors duration-100 select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={backspace}
                data-ocid="pin.delete_button"
                className="h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors duration-100 flex items-center justify-center select-none"
              >
                ⌫
              </button>
            </div>
          )}

          {attempts > 0 && !locked && (
            <p className="text-center text-amber-400 text-xs mt-4">
              {MAX_ATTEMPTS - attempts} attempt
              {MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
        <p className="text-slate-600 text-xs text-center mt-4">
          Admin access protected by PIN
        </p>
      </div>
    </div>
  );
}

// ======== Change PIN Modal ========
function ChangePinModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function save() {
    setError("");
    if (current !== getStoredPin()) {
      setError("Current PIN is incorrect.");
      return;
    }
    if (!/^\d{4}$/.test(next)) {
      setError("New PIN must be exactly 4 digits.");
      return;
    }
    if (next !== confirm) {
      setError("PINs do not match.");
      return;
    }
    localStorage.setItem(PIN_STORAGE_KEY, next);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrent("");
      setNext("");
      setConfirm("");
      onClose();
    }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm" data-ocid="pin.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            Change PIN
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label
              htmlFor="current-pin"
              className="text-sm font-medium mb-1 block"
            >
              Current PIN
            </Label>
            <Input
              id="current-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={current}
              onChange={(e) =>
                setCurrent(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="••••"
              data-ocid="pin.input"
            />
          </div>
          <div>
            <Label htmlFor="new-pin" className="text-sm font-medium mb-1 block">
              New PIN
            </Label>
            <Input
              id="new-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={next}
              onChange={(e) =>
                setNext(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="••••"
              data-ocid="pin.input"
            />
          </div>
          <div>
            <Label
              htmlFor="confirm-pin"
              className="text-sm font-medium mb-1 block"
            >
              Confirm New PIN
            </Label>
            <Input
              id="confirm-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirm}
              onChange={(e) =>
                setConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="••••"
              data-ocid="pin.input"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm" data-ocid="pin.error_state">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-sm" data-ocid="pin.success_state">
              PIN changed successfully!
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={save}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              data-ocid="pin.save_button"
            >
              <Check className="w-4 h-4 mr-1" /> Save PIN
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="pin.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ======== Error Banner ========
function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      data-ocid="admin.error_state"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ======== Success Banner ========
function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm"
      data-ocid="admin.success_state"
    >
      <Check className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ======== Main Admin Page ========
export default function AdminPage() {
  const { clear } = useInternetIdentity();
  const [tab, setTab] = useState<Tab>("notices");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePinOpen, setChangePinOpen] = useState(false);

  if (!pinUnlocked) {
    return <PinScreen onUnlock={() => setPinUnlocked(true)} />;
  }

  const navItems: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    group: string;
  }[] = [
    { id: "notices", label: "Notices", icon: Bell, group: "content" },
    { id: "news", label: "News & Events", icon: Newspaper, group: "content" },
    { id: "results", label: "Results", icon: Trophy, group: "content" },
    { id: "gallery", label: "Gallery", icon: Image, group: "content" },
    { id: "staff", label: "Staff & Teachers", icon: Users, group: "content" },
    {
      id: "principal",
      label: "Principal Message",
      icon: User,
      group: "settings",
    },
    {
      id: "schoolinfo",
      label: "School Info",
      icon: Settings,
      group: "settings",
    },
    {
      id: "contacts",
      label: "Contact Messages",
      icon: MessageSquare,
      group: "messages",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Buddha Deep EBS
            </p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {[
          { group: "content", label: "Content Management" },
          { group: "settings", label: "Settings" },
          { group: "messages", label: "Messages" },
        ].map(({ group, label }) => (
          <div key={group}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              {label}
            </p>
            <div className="space-y-0.5">
              {navItems
                .filter((i) => i.group === group)
                .map(({ id, label: lbl, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      setTab(id);
                      setSidebarOpen(false);
                    }}
                    data-ocid={`admin.${id}.tab`}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      tab === id
                        ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 pl-[10px]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent pl-[10px]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {lbl}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <button
          type="button"
          onClick={() => setChangePinOpen(true)}
          data-ocid="admin.pin.open_modal_button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <KeyRound className="w-4 h-4 shrink-0" />
          Change PIN
        </button>
        <button
          type="button"
          onClick={() => {
            clear();
            setPinUnlocked(false);
          }}
          data-ocid="admin.logout.button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Admin Panel</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-ocid="admin.sidebar.toggle"
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 bg-white border-r border-slate-200 shrink-0">
          <SidebarContent />
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
              role="button"
              tabIndex={-1}
            />
            <aside className="relative z-50 w-64 bg-white h-full shadow-2xl">
              <SidebarContent />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {navItems.find((i) => i.id === tab)?.label ?? "Dashboard"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{today}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clear();
                setPinUnlocked(false);
              }}
              data-ocid="admin.logout.button"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto">
            <StatsRow />
            <div className="mt-6">
              {tab === "notices" && <NoticesAdmin />}
              {tab === "news" && <NewsAdmin />}
              {tab === "results" && <ResultsAdmin />}
              {tab === "gallery" && <GalleryAdmin />}
              {tab === "staff" && <StaffAdmin />}
              {tab === "principal" && <PrincipalAdmin />}
              {tab === "schoolinfo" && <SchoolInfoAdmin />}
              {tab === "contacts" && <ContactsAdmin />}
            </div>
          </main>
        </div>
      </div>

      <ChangePinModal
        open={changePinOpen}
        onClose={() => setChangePinOpen(false)}
      />
    </div>
  );
}

// ======== Stats Row ========
function StatsRow() {
  const { actor } = useActor();
  const { data: notices = [] } = useQuery({
    queryKey: ["adminNotices"],
    queryFn: () => actor!.getNotices(),
    enabled: !!actor,
  });
  const { data: news = [] } = useQuery({
    queryKey: ["adminNews"],
    queryFn: () => actor!.getNewsEvents(),
    enabled: !!actor,
  });
  const { data: results = [] } = useQuery({
    queryKey: ["adminResults"],
    queryFn: () => actor!.getAllResults(),
    enabled: !!actor,
  });
  const { data: gallery = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => actor!.getGalleryItems(),
    enabled: !!actor,
  });

  const stats = [
    {
      label: "Notices",
      count: notices.length,
      icon: Bell,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "News",
      count: news.length,
      icon: Newspaper,
      color: "bg-violet-50 text-violet-600",
      border: "border-violet-200",
    },
    {
      label: "Results",
      count: results.length,
      icon: Trophy,
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-200",
    },
    {
      label: "Gallery",
      count: gallery.length,
      icon: Image,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-200",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      data-ocid="admin.stats.panel"
    >
      {stats.map(({ label, count, icon: Icon, color, border }, idx) => (
        <Card
          key={label}
          className={`border ${border} shadow-xs`}
          data-ocid={`admin.stats.card.${idx + 1}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">
                  {label}
                </p>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ======== Section header helper ========
function SectionHeader({
  title,
  icon: Icon,
}: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );
}

// ======== Notices ========
function NoticesAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editId, setEditId] = useState<bigint | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const {
    data: notices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminNotices"],
    queryFn: () => actor!.getNotices(),
    enabled: !!actor,
  });

  async function add() {
    if (!actor || !title.trim()) return;
    setIsSaving(true);
    setSaveError("");
    try {
      await actor.createNotice(title, body);
      setTitle("");
      setBody("");
      qc.invalidateQueries({ queryKey: ["adminNotices"] });
      qc.invalidateQueries({ queryKey: ["publishedNotices"] });
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Failed to add notice. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteNotice(id);
      qc.invalidateQueries({ queryKey: ["adminNotices"] });
      qc.invalidateQueries({ queryKey: ["publishedNotices"] });
    } catch (e) {
      console.error("Delete notice failed", e);
    }
  }

  async function togglePublish(notice: Notice) {
    if (!actor) return;
    try {
      if (notice.isPublished) {
        await actor.updateNotice({ ...notice, isPublished: false });
      } else {
        await actor.publishNotice(notice.id);
      }
      qc.invalidateQueries({ queryKey: ["adminNotices"] });
      qc.invalidateQueries({ queryKey: ["publishedNotices"] });
    } catch (e) {
      console.error("Toggle publish failed", e);
    }
  }

  async function saveEdit(notice: Notice) {
    if (!actor) return;
    setEditSaving(true);
    setEditError("");
    try {
      await actor.updateNotice({ ...notice, title: editTitle, body: editBody });
      setEditId(null);
      qc.invalidateQueries({ queryKey: ["adminNotices"] });
      qc.invalidateQueries({ queryKey: ["publishedNotices"] });
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Failed to update notice.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader title="Manage Notices" icon={Bell} />
      <Card className="mb-5 border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Add New Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actorFetching && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting to
              backend...
            </div>
          )}
          <div>
            <Label
              htmlFor="notice-title"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Title *
            </Label>
            <Input
              id="notice-title"
              placeholder="Notice title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="notices.input"
            />
          </div>
          <div>
            <Label
              htmlFor="notice-body"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Body
            </Label>
            <Textarea
              id="notice-body"
              placeholder="Notice body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              data-ocid="notices.textarea"
            />
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          <Button
            onClick={add}
            disabled={!title.trim() || isSaving || actorFetching || !actor}
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="notices.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Notice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3" data-ocid="notices.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load notices. Please refresh." />
      ) : notices.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="notices.empty_state"
        >
          <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No notices yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n, idx) => (
            <Card
              key={n.id.toString()}
              className="border-slate-200 shadow-xs"
              data-ocid={`notices.item.${idx + 1}`}
            >
              <CardContent className="p-4">
                {editId === n.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={2}
                      placeholder="Body"
                    />
                    {editError && <ErrorBanner message={editError} />}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(n)}
                        disabled={editSaving}
                        className="bg-blue-600"
                      >
                        {editSaving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {n.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={
                            n.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs"
                              : "bg-slate-100 text-slate-500 text-xs"
                          }
                        >
                          {n.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(n.date)}
                      </p>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {n.body}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePublish(n)}
                        title={n.isPublished ? "Unpublish" : "Publish"}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        data-ocid={`notices.toggle.${idx + 1}`}
                      >
                        {n.isPublished ? (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(n.id);
                          setEditTitle(n.title);
                          setEditBody(n.body);
                          setEditError("");
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        data-ocid={`notices.edit_button.${idx + 1}`}
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => del(n.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        data-ocid={`notices.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ======== News Admin ========
function NewsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminNews"],
    queryFn: () => actor!.getNewsEvents(),
    enabled: !!actor,
  });

  async function add() {
    if (!actor || !title.trim()) return;
    setIsSaving(true);
    setSaveError("");
    try {
      let blob: ExternalBlob | null = null;
      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      }
      await actor.createNewsEvent(title, body, blob);
      setTitle("");
      setBody("");
      setImageFile(null);
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["adminNews"] });
      qc.invalidateQueries({ queryKey: ["publishedNews"] });
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Failed to add news. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteNewsEvent(id);
      qc.invalidateQueries({ queryKey: ["adminNews"] });
      qc.invalidateQueries({ queryKey: ["publishedNews"] });
    } catch (e) {
      console.error("Delete news failed", e);
    }
  }

  async function togglePublish(item: NewsEvent) {
    if (!actor) return;
    try {
      if (item.isPublished) {
        await actor.updateNewsEvent({ ...item, isPublished: false });
      } else {
        await actor.publishNewsEvent(item.id);
      }
      qc.invalidateQueries({ queryKey: ["adminNews"] });
      qc.invalidateQueries({ queryKey: ["publishedNews"] });
    } catch (e) {
      console.error("Toggle publish failed", e);
    }
  }

  return (
    <div>
      <SectionHeader title="Manage News & Events" icon={Newspaper} />
      <Card className="mb-5 border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Add News / Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actorFetching && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting to
              backend...
            </div>
          )}
          <div>
            <Label
              htmlFor="news-title"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Title *
            </Label>
            <Input
              id="news-title"
              placeholder="News title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="news.input"
            />
          </div>
          <div>
            <Label
              htmlFor="news-body"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Body
            </Label>
            <Textarea
              id="news-body"
              placeholder="News body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              data-ocid="news.textarea"
            />
          </div>
          <div>
            <Label
              htmlFor="news-image-upload"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Image (optional)
            </Label>
            <input
              id="news-image-upload"
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              data-ocid="news.upload_button"
            />
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          <Button
            onClick={add}
            disabled={!title.trim() || isSaving || actorFetching || !actor}
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="news.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add News
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3" data-ocid="news.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load news. Please refresh." />
      ) : items.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="news.empty_state"
        >
          <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No news yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <Card
              key={item.id.toString()}
              className="border-slate-200 shadow-xs"
              data-ocid={`news.item.${idx + 1}`}
            >
              <CardContent className="p-4 flex gap-4">
                {item.blobId && (
                  <img
                    src={item.blobId.getDirectURL()}
                    alt={item.title}
                    className="w-20 h-16 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {item.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={
                            item.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs"
                              : "bg-slate-100 text-slate-500 text-xs"
                          }
                        >
                          {item.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePublish(item)}
                        title={item.isPublished ? "Unpublish" : "Publish"}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        data-ocid={`news.toggle.${idx + 1}`}
                      >
                        {item.isPublished ? (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => del(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        data-ocid={`news.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ======== Results Admin ========
function ResultsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const emptyForm = {
    rollNumber: "",
    studentName: "",
    studentClass: "",
    academicYear: "",
    subjectsRaw: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editTarget, setEditTarget] = useState<StudentResult | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminResults"],
    queryFn: () => actor!.getAllResults(),
    enabled: !!actor,
  });

  function parseSubjects(raw: string) {
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(",").map((s) => s.trim());
        const n = Number.parseInt(parts[1] ?? "0");
        return {
          subject: parts[0] ?? "",
          marks: BigInt(Number.isNaN(n) ? 0 : n),
          grade: parts[2] ?? "",
        };
      });
  }

  async function add() {
    if (!actor || !form.rollNumber.trim()) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const subjects = parseSubjects(form.subjectsRaw);
      let blob: ExternalBlob | null = null;
      if (pdfFile) {
        const bytes = new Uint8Array(await pdfFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      }
      await actor.addStudentResult(
        form.rollNumber,
        form.studentName,
        form.studentClass,
        subjects,
        form.academicYear,
        blob,
      );
      setForm(emptyForm);
      setPdfFile(null);
      qc.invalidateQueries({ queryKey: ["adminResults"] });
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Failed to add result. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteStudentResult(id);
      qc.invalidateQueries({ queryKey: ["adminResults"] });
    } catch (e) {
      console.error("Delete result failed", e);
    }
  }

  function startEdit(r: StudentResult) {
    setEditTarget(r);
    setEditForm({
      rollNumber: r.rollNumber,
      studentName: r.studentName,
      studentClass: r.studentClass,
      academicYear: r.academicYear,
      subjectsRaw: r.subjects
        .map((s) => `${s.subject}, ${s.marks}, ${s.grade}`)
        .join("\n"),
    });
    setEditError("");
  }

  async function saveEdit() {
    if (!actor || !editTarget) return;
    setEditSaving(true);
    setEditError("");
    try {
      const subjects = parseSubjects(editForm.subjectsRaw);
      await actor.updateStudentResult({
        ...editTarget,
        rollNumber: editForm.rollNumber,
        studentName: editForm.studentName,
        studentClass: editForm.studentClass,
        academicYear: editForm.academicYear,
        subjects,
      });
      setEditTarget(null);
      qc.invalidateQueries({ queryKey: ["adminResults"] });
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Failed to update result.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader title="Manage Results" icon={Trophy} />
      <Card className="mb-5 border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Add Student Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actorFetching && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting to
              backend...
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Roll Number *
              </Label>
              <Input
                placeholder="e.g. 2081-001"
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
                data-ocid="results.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Student Name
              </Label>
              <Input
                placeholder="Full name"
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Class
              </Label>
              <Input
                placeholder="e.g. Grade 10"
                value={form.studentClass}
                onChange={(e) =>
                  setForm({ ...form, studentClass: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Academic Year
              </Label>
              <Input
                placeholder="e.g. 2081"
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              Subjects (Subject, Marks, Grade — one per line)
            </Label>
            <Textarea
              placeholder={"Mathematics, 85, A+\nEnglish, 78, B+"}
              value={form.subjectsRaw}
              onChange={(e) =>
                setForm({ ...form, subjectsRaw: e.target.value })
              }
              rows={4}
              data-ocid="results.textarea"
            />
          </div>
          <div>
            <Label
              htmlFor="result-pdf-upload"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              PDF Report (optional)
            </Label>
            <input
              id="result-pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              data-ocid="results.upload_button"
            />
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          <Button
            onClick={add}
            disabled={
              !form.rollNumber.trim() || isSaving || actorFetching || !actor
            }
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="results.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Result
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3" data-ocid="results.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load results. Please refresh." />
      ) : results.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="results.empty_state"
        >
          <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No results uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <Card
              key={r.id.toString()}
              className="border-slate-200 shadow-xs"
              data-ocid={`results.item.${idx + 1}`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {r.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Roll: {r.rollNumber} · {r.studentClass} · {r.academicYear}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {r.subjects.length} subject(s)
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    data-ocid={`results.edit_button.${idx + 1}`}
                  >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => del(r.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    data-ocid={`results.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-lg" data-ocid="results.dialog">
          <DialogHeader>
            <DialogTitle>Edit Student Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Roll Number *
                </Label>
                <Input
                  value={editForm.rollNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, rollNumber: e.target.value })
                  }
                  placeholder="Roll number"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Student Name
                </Label>
                <Input
                  value={editForm.studentName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, studentName: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Class
                </Label>
                <Input
                  value={editForm.studentClass}
                  onChange={(e) =>
                    setEditForm({ ...editForm, studentClass: e.target.value })
                  }
                  placeholder="e.g. Grade 10"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Academic Year
                </Label>
                <Input
                  value={editForm.academicYear}
                  onChange={(e) =>
                    setEditForm({ ...editForm, academicYear: e.target.value })
                  }
                  placeholder="e.g. 2081"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Subjects (Subject, Marks, Grade)
              </Label>
              <Textarea
                value={editForm.subjectsRaw}
                onChange={(e) =>
                  setEditForm({ ...editForm, subjectsRaw: e.target.value })
                }
                rows={4}
                placeholder={"Mathematics, 85, A+\nEnglish, 78, B+"}
              />
            </div>
            {editError && <ErrorBanner message={editError} />}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={saveEdit}
                disabled={editSaving}
                className="bg-blue-600 hover:bg-blue-700"
                data-ocid="results.save_button"
              >
                {editSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditTarget(null)}
                data-ocid="results.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ======== Gallery Admin ========
function GalleryAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => actor!.getGalleryItems(),
    enabled: !!actor,
  });

  async function upload() {
    if (!actor || !mediaFile || !title.trim()) return;
    setUploading(true);
    setUploadError("");
    try {
      const bytes = new Uint8Array(await mediaFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const mediaType = mediaFile.type.startsWith("video") ? "video" : "image";
      await actor.addGalleryItem(title, blob, mediaType);
      setTitle("");
      setMediaFile(null);
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteGalleryItem(id);
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e) {
      console.error("Delete gallery item failed", e);
    }
  }

  return (
    <div>
      <SectionHeader title="Manage Gallery" icon={Image} />
      <Card className="mb-5 border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Upload Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actorFetching && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting to
              backend...
            </div>
          )}
          <div>
            <Label
              htmlFor="gallery-title"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Title *
            </Label>
            <Input
              id="gallery-title"
              placeholder="Photo/video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="gallery.input"
            />
          </div>
          <div>
            <Label
              htmlFor="gallery-upload"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Image or Video *
            </Label>
            <input
              id="gallery-upload"
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              data-ocid="gallery.upload_button"
            />
          </div>
          {uploadError && <ErrorBanner message={uploadError} />}
          <Button
            onClick={upload}
            disabled={
              uploading ||
              !mediaFile ||
              !title.trim() ||
              actorFetching ||
              !actor
            }
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="gallery.submit_button"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          data-ocid="gallery.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load gallery. Please refresh." />
      ) : items.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="gallery.empty_state"
        >
          <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No gallery items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id.toString()}
              className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-xs"
              data-ocid={`gallery.item.${idx + 1}`}
            >
              {item.mediaType === "video" ? (
                // biome-ignore lint/a11y/useMediaCaption: gallery admin preview
                <video
                  src={item.blobId.getDirectURL()}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <img
                  src={item.blobId.getDirectURL()}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-2 bg-white">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {item.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => del(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                data-ocid={`gallery.delete_button.${idx + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ======== Staff Admin ========
function StaffAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", designation: "", bio: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    designation: "",
    bio: "",
  });
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const {
    data: staff = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: () => actor!.getStaffMembers(),
    enabled: !!actor,
  });

  async function add() {
    if (!actor || !form.name.trim()) return;
    setIsSaving(true);
    setSaveError("");
    try {
      let blob: ExternalBlob | null = null;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      }
      await actor.addStaffMember(form.name, form.designation, form.bio, blob);
      setForm({ name: "", designation: "", bio: "" });
      setPhotoFile(null);
      qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Failed to add staff member. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteStaffMember(id);
      qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (e) {
      console.error("Delete staff member failed", e);
    }
  }

  function startEdit(member: StaffMember) {
    setEditTarget(member);
    setEditForm({
      name: member.name,
      designation: member.designation,
      bio: member.bio,
    });
    setEditPhotoFile(null);
    setEditError("");
  }

  async function saveEdit() {
    if (!actor || !editTarget) return;
    setEditSaving(true);
    setEditError("");
    try {
      let blobId = editTarget.blobId;
      if (editPhotoFile) {
        const bytes = new Uint8Array(await editPhotoFile.arrayBuffer());
        blobId = ExternalBlob.fromBytes(bytes);
      }
      await actor.updateStaffMember({
        ...editTarget,
        name: editForm.name,
        designation: editForm.designation,
        bio: editForm.bio,
        blobId,
      });
      setEditTarget(null);
      qc.invalidateQueries({ queryKey: ["staff"] });
    } catch (e) {
      setEditError(
        e instanceof Error ? e.message : "Failed to update staff member.",
      );
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader title="Manage Staff & Teachers" icon={Users} />
      <Card className="mb-5 border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Add Staff Member / Teacher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actorFetching && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting to
              backend...
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Full Name *
              </Label>
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="staff.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Designation / Role
              </Label>
              <Input
                placeholder="e.g. Mathematics Teacher"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              Bio / Description
            </Label>
            <Textarea
              placeholder="Short biography"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={2}
              data-ocid="staff.textarea"
            />
          </div>
          <div>
            <Label
              htmlFor="staff-photo-upload"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Photo (optional)
            </Label>
            <input
              id="staff-photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              data-ocid="staff.upload_button"
            />
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          <Button
            onClick={add}
            disabled={!form.name.trim() || isSaving || actorFetching || !actor}
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="staff.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Add Staff Member
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3" data-ocid="staff.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load staff. Please refresh." />
      ) : staff.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="staff.empty_state"
        >
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            No staff added yet. Add your first staff member above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {staff.map((member, idx) => (
            <Card
              key={member.id.toString()}
              className="border-slate-200 shadow-xs"
              data-ocid={`staff.item.${idx + 1}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                  {member.blobId ? (
                    <img
                      src={member.blobId.getDirectURL()}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-blue-600">{member.designation}</p>
                  {member.bio && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {member.bio}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(member)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    data-ocid={`staff.edit_button.${idx + 1}`}
                  >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => del(member.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    data-ocid={`staff.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-lg" data-ocid="staff.dialog">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Full Name *
                </Label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-600 mb-1 block">
                  Designation / Role
                </Label>
                <Input
                  value={editForm.designation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, designation: e.target.value })
                  }
                  placeholder="e.g. Mathematics Teacher"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Bio / Description
              </Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                rows={3}
                placeholder="Short biography"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Update Photo (optional — leave blank to keep existing)
              </Label>
              {editTarget?.blobId && !editPhotoFile && (
                <div className="mb-2">
                  <img
                    src={editTarget.blobId.getDirectURL()}
                    alt="Current"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <p className="text-xs text-slate-400 mt-1">Current photo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditPhotoFile(e.target.files?.[0] ?? null)}
                className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {editError && <ErrorBanner message={editError} />}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={saveEdit}
                disabled={editSaving || !editForm.name.trim()}
                className="bg-blue-600 hover:bg-blue-700"
                data-ocid="staff.save_button"
              >
                {editSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditTarget(null)}
                data-ocid="staff.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ======== Principal Message Admin ========
function PrincipalAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: existing, isLoading: isLoadingExisting } = useQuery({
    queryKey: ["principalMsg"],
    queryFn: () => actor!.getPrincipalMessage(),
    enabled: !!actor,
  });

  useEffect(() => {
    if (existing) {
      setName(existing.principalName);
      setMessage(existing.message);
    }
  }, [existing]);

  async function save() {
    if (!actor) return;
    setIsSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      let blob: ExternalBlob | null = null;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      } else if (existing?.blobId) {
        blob = existing.blobId;
      }
      await actor.setPrincipalMessage(message, name, blob);
      setSaved(true);
      setPhotoFile(null);
      setTimeout(() => setSaved(false), 3000);
      qc.invalidateQueries({ queryKey: ["principalMsg"] });
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Failed to save. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader title="Principal's Welcome Message" icon={User} />
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-5 space-y-4">
          {(actorFetching || isLoadingExisting) && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              {actorFetching
                ? "Connecting to backend..."
                : "Loading existing message..."}
            </div>
          )}
          <div>
            <Label
              htmlFor="principal-name"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Principal's Full Name *
            </Label>
            <Input
              id="principal-name"
              placeholder="e.g. Mr. Ram Prasad Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="principal.input"
            />
          </div>
          <div>
            <Label
              htmlFor="principal-message"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Welcome Message / Speech
            </Label>
            <Textarea
              id="principal-message"
              placeholder="Write the principal's welcome message to students and parents here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              data-ocid="principal.textarea"
            />
            <p className="text-xs text-slate-400 mt-1">
              {message.length} characters
            </p>
          </div>
          <div>
            <Label
              htmlFor="principal-photo-upload"
              className="text-xs font-medium text-slate-600 mb-1 block"
            >
              Principal's Photo
              {existing?.blobId && !photoFile && (
                <span className="ml-2 text-emerald-600 text-xs">
                  (Current photo will be kept)
                </span>
              )}
            </Label>
            {existing?.blobId && !photoFile && (
              <div className="mb-2">
                <img
                  src={existing.blobId.getDirectURL()}
                  alt="Current principal"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                />
                <p className="text-xs text-slate-400 mt-1">Current photo</p>
              </div>
            )}
            <input
              id="principal-photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              data-ocid="principal.upload_button"
            />
            {photoFile && (
              <p className="text-xs text-blue-600 mt-1">
                New photo: {photoFile.name}
              </p>
            )}
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          {saved && (
            <SuccessBanner message="Principal message saved successfully!" />
          )}
          <Button
            onClick={save}
            disabled={isSaving || actorFetching || !actor}
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="principal.save_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Principal Message"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ======== School Info Admin ========
function SchoolInfoAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const qc = useQueryClient();
  const emptyInfo = {
    name: "Buddha Deep English Boarding School",
    address: "Buddha Deep, Lumbini Zone, Butwal, Nepal",
    phone: "+977-071-XXXXXX",
    email: "info@buddhadeepebs.edu.np",
    mapEmbedUrl: "",
  };
  const [form, setForm] = useState(emptyInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: existing, isLoading: isLoadingExisting } = useQuery({
    queryKey: ["schoolInfo"],
    queryFn: () => actor!.getSchoolInfo(),
    enabled: !!actor,
  });

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  async function save() {
    if (!actor) return;
    setIsSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      await actor.setSchoolInfo(
        form.name,
        form.address,
        form.phone,
        form.email,
        form.mapEmbedUrl,
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      qc.invalidateQueries({ queryKey: ["schoolInfo"] });
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "Failed to save school info. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader title="School Information" icon={Settings} />
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-5 space-y-4">
          {(actorFetching || isLoadingExisting) && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              {actorFetching
                ? "Connecting to backend..."
                : "Loading school info..."}
            </div>
          )}
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              School Name
            </Label>
            <Input
              placeholder="School Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-ocid="schoolinfo.input"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              Address
            </Label>
            <Input
              placeholder="Full address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Phone
              </Label>
              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600 mb-1 block">
                Email
              </Label>
              <Input
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              Google Maps Embed URL
            </Label>
            <Input
              placeholder="https://maps.google.com/embed..."
              value={form.mapEmbedUrl}
              onChange={(e) =>
                setForm({ ...form, mapEmbedUrl: e.target.value })
              }
            />
            <p className="text-xs text-slate-400 mt-1">
              Paste the full Google Maps embed URL for the school location.
            </p>
          </div>
          {saveError && <ErrorBanner message={saveError} />}
          {saved && <SuccessBanner message="School info saved successfully!" />}
          <Button
            onClick={save}
            disabled={isSaving || actorFetching || !actor}
            className="bg-blue-600 hover:bg-blue-700"
            data-ocid="schoolinfo.save_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save School Info"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ======== Contact Messages ========
function ContactsAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: () => actor!.getContactMessages(),
    enabled: !!actor,
  });

  async function del(id: bigint) {
    if (!actor) return;
    try {
      await actor.deleteContactMessage(id);
      qc.invalidateQueries({ queryKey: ["contactMessages"] });
    } catch (e) {
      console.error("Delete contact message failed", e);
    }
  }

  return (
    <div>
      <SectionHeader title="Contact Messages" icon={MessageSquare} />
      {isLoading ? (
        <div className="space-y-3" data-ocid="contacts.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorBanner message="Failed to load messages. Please refresh." />
      ) : messages.length === 0 ? (
        <div
          className="text-center py-10 text-slate-400"
          data-ocid="contacts.empty_state"
        >
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            No messages yet. Messages from the Contact page appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <Card
              key={msg.id.toString()}
              className="border-slate-200 shadow-xs"
              data-ocid={`contacts.item.${idx + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm">
                        {msg.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 ml-9">
                      {msg.email}
                      {msg.phone ? ` · ${msg.phone}` : ""}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 ml-9 leading-relaxed">
                      {msg.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 ml-9">
                      {formatDate(msg.date)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => del(msg.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    data-ocid={`contacts.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
