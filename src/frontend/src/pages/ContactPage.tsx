import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useActor } from "../hooks/useActor";

const MAX_MESSAGE_LENGTH = 500;

const SUBJECTS = [
  "Admission Enquiry",
  "General Query",
  "Result Enquiry",
  "Staff / Teacher Query",
  "Fee & Scholarship",
  "Other",
];

const INFO_CARDS = [
  {
    icon: MapPin,
    label: "Address",
    value: "Buddha Deep, Lumbini Zone, Butwal-11, Nepal",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977-071-540XXX / +977-9857XXXXXX",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@buddhadeepebs.edu.np",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon\u2013Fri: 9AM \u2013 4PM  |  Sat: 9AM \u2013 1PM",
    color: "bg-amber-100 text-amber-600",
  },
];

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const { actor, isFetching } = useActor();
  const actorReady = !!actor && !isFetching;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Please enter a valid email address.";
    if (!form.subject) errors.subject = "Please select a subject.";
    if (!form.message.trim()) errors.message = "Message cannot be empty.";
    return errors;
  }

  const errors = validate();
  const isFormValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!actor || !isFormValid) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const fullMessage = `[${form.subject}] ${form.message}`;
      await actor.submitContactMessage(
        form.name,
        form.email,
        form.phone,
        fullMessage,
      );
      setSubmitted(true);
    } catch (_err) {
      setSubmitError(
        "Failed to send your message. Please try again or contact us by phone.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TooltipProvider>
      <div>
        {/* Hero */}
        <div className="hero-shimmer text-white py-14">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="text-blue-300 text-sm mb-3">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-white font-medium">Contact Us</span>
            </nav>
            <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-blue-200 mt-2 text-lg">
              We\u2019d love to hear from you. Reach out and we\u2019ll respond
              within one business day.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-2 gap-14">
            {/* LEFT: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">
                Send a Message
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Fields marked <span className="text-red-500">*</span> are
                required.
              </p>

              {/* Connecting spinner */}
              {!actorReady && !submitting && (
                <div
                  data-ocid="contact.loading_state"
                  className="flex items-center gap-3 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-sm"
                >
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  Connecting to server, please wait\u2026
                </div>
              )}

              {/* Error banner */}
              {submitError && (
                <div
                  data-ocid="contact.error_state"
                  className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitted ? (
                <div
                  data-ocid="contact.success_state"
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700 text-sm mb-4">
                    Thank you, <strong>{form.name}</strong>. We received your
                    message about <strong>{form.subject}</strong> and will reply
                    to <strong>{form.email}</strong> within one business day.
                  </p>
                  <Button
                    data-ocid="contact.primary_button"
                    className="bg-green-700 hover:bg-green-800 text-white"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError(null);
                      setTouched({});
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  data-ocid="contact.panel"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      data-ocid="contact.input"
                      placeholder="e.g. Ram Kumar Sharma"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      onBlur={() => handleBlur("name")}
                      className={
                        touched.name && errors.name
                          ? "border-red-400 focus-visible:ring-red-300"
                          : ""
                      }
                    />
                    {touched.name && errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      data-ocid="contact.input"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      onBlur={() => handleBlur("email")}
                      className={
                        touched.email && errors.email
                          ? "border-red-400 focus-visible:ring-red-300"
                          : ""
                      }
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      data-ocid="contact.input"
                      placeholder="+977-98XXXXXXXX (optional)"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.subject}
                      onValueChange={(val) => {
                        setForm({ ...form, subject: val });
                        setTouched((prev) => ({ ...prev, subject: true }));
                      }}
                    >
                      <SelectTrigger
                        id="contact-subject"
                        data-ocid="contact.select"
                        className={
                          touched.subject && errors.subject
                            ? "border-red-400 focus:ring-red-300"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select a subject\u2026" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.subject && errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <Label htmlFor="contact-message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <span
                        className={`text-xs ${
                          form.message.length > MAX_MESSAGE_LENGTH
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {form.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.textarea"
                      placeholder="Write your message here\u2026"
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value.slice(0, MAX_MESSAGE_LENGTH),
                        })
                      }
                      onBlur={() => handleBlur("message")}
                      rows={5}
                      className={
                        touched.message && errors.message
                          ? "border-red-400 focus-visible:ring-red-300"
                          : ""
                      }
                    />
                    {touched.message && errors.message && (
                      <p className="text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block w-full">
                        <Button
                          data-ocid="contact.submit_button"
                          type="submit"
                          disabled={submitting || !actorReady}
                          className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-semibold py-2.5 text-base shadow-md transition-all"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending\u2026
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!actorReady && (
                      <TooltipContent>
                        Please wait, connecting to server\u2026
                      </TooltipContent>
                    )}
                  </Tooltip>
                </form>
              )}
            </div>

            {/* RIGHT: Info + Map */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">
                School Information
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Visit us or reach out through any channel below.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {INFO_CARDS.map(({ icon: Icon, label, value, color }) => (
                  <Card
                    key={label}
                    className="border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-0.5 leading-snug">
                          {value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border shadow-sm">
                <div className="bg-blue-900 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Buddha Deep English Boarding School \u2013 Butwal, Nepal
                </div>
                <iframe
                  title="School Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31776722041!2d83.44026!3d27.70169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996864339b86f71%3A0xa8df65be2e476178!2sButwal%2C%20Nepal!5e0!3m2!1sen!2s!4v1700000000000"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
