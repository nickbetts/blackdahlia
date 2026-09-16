"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CalendarOff,
  Camera,
  AtSign,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  ImageOff,
  Images,
  LogOut,
  Mail,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import type { ArtistSlug } from "@/content/studio";
import {
  enquiryStatuses,
  weekdayLabels,
  type AdminBooking,
  type AdminEnquiry,
  type AvailabilityStatus,
  type ArtistAdminOption,
  type BookingStatus,
  type EnquiryImage,
  type GalleryImage,
  type TimeOffPeriod,
  type WeekdayIndex,
  type WeeklyAvailabilityRule,
} from "@/lib/admin-types";

type AdminDashboardProps = {
  username: string;
  artists: ArtistAdminOption[];
  initialEnquiries: AdminEnquiry[];
  initialBookings: AdminBooking[];
  initialWeeklyAvailability: WeeklyAvailabilityRule[];
  initialTimeOff: TimeOffPeriod[];
  initialGallery: GalleryImage[];
};

type EnquiryFilter = "action" | "all" | "resolved";

type AdminTabKey = "enquiries" | "calendar" | "availability" | "gallery";

type ManualBookingDraft = {
  artistSlug: ArtistSlug;
  clientName: string;
  clientEmail: string;
  startAt: string;
  endAt: string;
  notes: string;
};

type BookingEditDraft = {
  startAt: string;
  endAt: string;
  notes: string;
};

type WeeklyRuleDraft = {
  weekday: WeekdayIndex;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

type TimeOffDraft = {
  artistSlug: ArtistSlug;
  startAt: string;
  endAt: string;
  reason: string;
};

const actionableEnquiryStatuses = new Set(["new", "in_review", "awaiting_client"]);

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateTimeInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function buildCalendarGrid(monthCursor: Date) {
  const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const end = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);

  const startOffset = (start.getDay() + 6) % 7;
  const totalDays = end.getDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(start);
    date.setDate(index - startOffset + 1);

    return {
      date,
      inCurrentMonth: date.getMonth() === monthCursor.getMonth(),
    };
  });
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

// Formats that most non-Safari browsers can't render natively.
const nonRenderableImageMimes = new Set([
  "image/heic",
  "image/heif",
  "image/tiff",
  "image/bmp",
]);

function formatImageKind(mimeType: string): string {
  const short = mimeType.replace(/^image\//, "").toUpperCase();
  return short || "FILE";
}

function EnquiryReferenceThumb({ image, imageUrl }: { image: EnquiryImage; imageUrl: string }) {
  const [hasError, setHasError] = useState(
    nonRenderableImageMimes.has(image.mimeType.toLowerCase())
  );

  return (
    <a
      href={imageUrl}
      target="_blank"
      rel="noreferrer"
      className={`adminEnquiryImageLink${hasError ? " is-fallback" : ""}`}
      aria-label={`Open ${image.fileName}`}
      title={`${image.fileName}${image.byteSize ? ` (${formatBytes(image.byteSize)})` : ""}`}
    >
      {hasError ? (
        <div className="adminEnquiryImageFallback">
          <ImageOff size={18} aria-hidden />
          <strong>{formatImageKind(image.mimeType)}</strong>
          <span>{formatBytes(image.byteSize)}</span>
          <span className="adminEnquiryImageFallbackOpen">
            <Download size={11} /> Open
          </span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={`Reference upload: ${image.fileName}`}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
    </a>
  );
}

function monthTitle(monthCursor: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(monthCursor);
}

function defaultBookingDraft(artistSlug: ArtistSlug): ManualBookingDraft {
  const start = new Date();
  start.setHours(Math.max(start.getHours() + 1, 10), 0, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + 2);

  return {
    artistSlug,
    clientName: "",
    clientEmail: "",
    startAt: toDateTimeInputValue(start),
    endAt: toDateTimeInputValue(end),
    notes: "",
  };
}

function defaultTimeOffDraft(artistSlug: ArtistSlug): TimeOffDraft {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  const end = new Date(start);
  end.setHours(23, 59, 0, 0);

  return {
    artistSlug,
    startAt: toDateTimeInputValue(start),
    endAt: toDateTimeInputValue(end),
    reason: "",
  };
}

function defaultWeeklyDraftsForArtist(
  rules: WeeklyAvailabilityRule[],
  artistSlug: ArtistSlug
): WeeklyRuleDraft[] {
  return Array.from({ length: 7 }, (_unused, index) => {
    const weekday = index as WeekdayIndex;
    const existing = rules.find(
      (rule) => rule.artistSlug === artistSlug && rule.weekday === weekday
    );
    if (existing) {
      return {
        weekday,
        startTime: existing.startTime,
        endTime: existing.endTime,
        enabled: existing.enabled,
      };
    }
    return {
      weekday,
      startTime: "10:00",
      endTime: "18:00",
      enabled: false,
    };
  });
}

function inferArtistSlug(enquiry: AdminEnquiry, artists: ArtistAdminOption[]): ArtistSlug {
  if (enquiry.assignedArtistSlug) {
    return enquiry.assignedArtistSlug;
  }

  const preferred = enquiry.preferredArtist.trim().toLowerCase();
  const byName = artists.find((artist) => artist.name.trim().toLowerCase() === preferred);

  return byName?.slug || artists[0].slug;
}

function sortBookings(list: AdminBooking[]): AdminBooking[] {
  return [...list].sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
}

function sortTimeOff(list: TimeOffPeriod[]): TimeOffPeriod[] {
  return [...list].sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
}

function sortEnquiriesForAction(list: AdminEnquiry[]): AdminEnquiry[] {
  const statusPriority: Record<AdminEnquiry["status"], number> = {
    new: 0,
    in_review: 1,
    awaiting_client: 2,
    booked: 3,
    closed: 4,
  };

  return [...list].sort((a, b) => {
    const priority = statusPriority[a.status] - statusPriority[b.status];

    if (priority !== 0) {
      return priority;
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

function bookingEditDraftFromBooking(booking: AdminBooking): BookingEditDraft {
  return {
    startAt: toDateTimeInputValue(new Date(booking.startAt)),
    endAt: toDateTimeInputValue(new Date(booking.endAt)),
    notes: booking.notes,
  };
}

function rangesOverlap(
  a: { startAt: string; endAt: string },
  b: { startAt: string; endAt: string }
): boolean {
  return (
    Date.parse(a.startAt) < Date.parse(b.endAt) && Date.parse(a.endAt) > Date.parse(b.startAt)
  );
}

function buildDayWindow(
  date: Date,
  rule: { startTime: string; endTime: string }
): { startAt: string; endAt: string } | null {
  const [sh, sm] = rule.startTime.split(":").map((part) => Number.parseInt(part, 10));
  const [eh, em] = rule.endTime.split(":").map((part) => Number.parseInt(part, 10));
  const start = new Date(date);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(date);
  end.setHours(eh, em, 0, 0);
  if (end <= start) return null;
  return { startAt: start.toISOString(), endAt: end.toISOString() };
}

function resolveDayStatus(
  date: Date,
  rule: { startTime: string; endTime: string } | undefined,
  timeOff: TimeOffPeriod[],
  bookings: AdminBooking[]
): { status: AvailabilityStatus | "off" | "none"; window: { startAt: string; endAt: string } | null } {
  if (!rule) return { status: "none", window: null };
  const window = buildDayWindow(date, rule);
  if (!window) return { status: "none", window: null };
  const isOff = timeOff.some((period) => rangesOverlap(window, period));
  if (isOff) return { status: "off", window };
  const isBooked = bookings.some(
    (booking) => booking.status === "scheduled" && rangesOverlap(window, booking)
  );
  return { status: isBooked ? "booked" : "free", window };
}

function formatDateOnly(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function BookingCard({
  booking,
  artistLabel,
}: {
  booking: AdminBooking;
  artistLabel?: string | null;
}) {
  return (
    <article className={`adminBookingCard is-${booking.status}`}>
      <p className="adminBookingTime">
        {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
      </p>
      {artistLabel ? <span className="adminBookingArtist">{artistLabel}</span> : null}
      <strong>{booking.clientName}</strong>
      <span>{booking.clientEmail}</span>
      <span className={`adminBookingStatus adminBookingStatus--${booking.status}`}>
        {booking.status.replaceAll("_", " ")}
      </span>
    </article>
  );
}

function ArtistBookingItem({
  booking,
  onUpdated,
  artistLabel,
}: {
  booking: AdminBooking;
  onUpdated: (next: AdminBooking) => void;
  artistLabel?: string | null;
}) {
  const [draft, setDraft] = useState<BookingEditDraft>(() => bookingEditDraftFromBooking(booking));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function patchBooking(update: Partial<BookingEditDraft> & { status?: BookingStatus }) {
    setMessage(null);
    setIsError(false);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });

      const payload = (await response.json().catch(() => null)) as
        | { booking?: AdminBooking; error?: string }
        | null;

      if (!response.ok || !payload?.booking) {
        throw new Error(payload?.error || "Could not update booking.");
      }

      onUpdated(payload.booking);
      setDraft(bookingEditDraftFromBooking(payload.booking));
      setMessage("Booking updated.");
      setIsEditing(false);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not update booking.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await patchBooking({
      startAt: draft.startAt,
      endAt: draft.endAt,
      notes: draft.notes,
    });
  }

  return (
    <article className={`adminArtistBookingItem is-${booking.status}`}>
      <header>
        <div>
          <strong>{booking.clientName}</strong>
          {artistLabel ? <span className="adminArtistBookingArtist">{artistLabel}</span> : null}
          <p>
            <Clock3 size={13} /> {formatDateTime(booking.startAt)} - {formatTime(booking.endAt)}
          </p>
        </div>
        <span className={`adminBookingPill adminBookingPill--${booking.status}`}>
          {booking.status === "cancelled" ? "Cancelled" : "Scheduled"}
        </span>
      </header>

      <p className="adminArtistBookingEmail">{booking.clientEmail}</p>

      <div className="adminArtistBookingActions">
        <button
          type="button"
          className="ghostButton"
          onClick={() =>
            void patchBooking({
              status: booking.status === "cancelled" ? "scheduled" : "cancelled",
            })
          }
          disabled={isSaving}
        >
          {booking.status === "cancelled" ? (
            <>
              <RotateCcw size={14} /> Restore booking
            </>
          ) : (
            <>
              <XCircle size={14} /> Cancel booking
            </>
          )}
        </button>

        <button
          type="button"
          className="ghostButton"
          onClick={() => setIsEditing((current) => !current)}
          disabled={isSaving}
        >
          {isEditing ? "Close editor" : "Edit time/notes"}
        </button>
      </div>

      {isEditing ? (
        <form className="adminBookingEditForm" onSubmit={handleSaveChanges}>
          <div className="adminFieldRow">
            <label>
              Start
              <input
                type="datetime-local"
                value={draft.startAt}
                onChange={(event) => setDraft((current) => ({ ...current, startAt: event.target.value }))}
                required
              />
            </label>
            <label>
              End
              <input
                type="datetime-local"
                value={draft.endAt}
                onChange={(event) => setDraft((current) => ({ ...current, endAt: event.target.value }))}
                required
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              rows={3}
              value={draft.notes}
              onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>

          <button className="primaryButton" type="submit" disabled={isSaving}>
            <Save size={14} /> {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : null}

      {message ? (
        <p className={`adminNotice ${isError ? "adminNoticeError" : "adminNoticeSuccess"}`}>{message}</p>
      ) : null}
    </article>
  );
}

function EnquiryCard({
  enquiry,
  artists,
  onUpdated,
  onBookingCreated,
}: {
  enquiry: AdminEnquiry;
  artists: ArtistAdminOption[];
  onUpdated: (next: AdminEnquiry) => void;
  onBookingCreated: (booking: AdminBooking) => void;
}) {
  const [status, setStatus] = useState(enquiry.status);
  const [assignedArtistSlug, setAssignedArtistSlug] = useState<ArtistSlug>(
    inferArtistSlug(enquiry, artists)
  );
  const [adminNotes, setAdminNotes] = useState(enquiry.adminNotes);
  const [quickStartAt, setQuickStartAt] = useState(defaultBookingDraft(assignedArtistSlug).startAt);
  const [quickEndAt, setQuickEndAt] = useState(defaultBookingDraft(assignedArtistSlug).endAt);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  async function saveEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedArtistSlug,
          adminNotes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { enquiry?: AdminEnquiry; error?: string }
        | null;

      if (!response.ok || !payload?.enquiry) {
        throw new Error(payload?.error || "Could not save enquiry update.");
      }

      onUpdated(payload.enquiry);
      setMessage("Enquiry updated.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not save enquiry update.");
    } finally {
      setIsSaving(false);
    }
  }

  async function createBookingFromEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          artistSlug: assignedArtistSlug,
          clientName: `${enquiry.firstName} ${enquiry.lastName}`,
          clientEmail: enquiry.email || "",
          startAt: quickStartAt,
          endAt: quickEndAt,
          notes: adminNotes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { booking?: AdminBooking; error?: string }
        | null;

      if (!response.ok || !payload?.booking) {
        throw new Error(payload?.error || "Could not create booking from enquiry.");
      }

      onBookingCreated(payload.booking);
      onUpdated({
        ...enquiry,
        status: "booked",
        assignedArtistSlug,
        adminNotes,
        updatedAt: new Date().toISOString(),
      });
      setStatus("booked");
      setMessage("Booking added to calendar.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not create booking.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className={`adminEnquiryCard is-${status}`}>
      <header>
        <div>
          <strong>
            {enquiry.firstName} {enquiry.lastName}
          </strong>
          <p>{formatDateTime(enquiry.createdAt)}</p>
        </div>
        <span className={`adminStatusTag is-${status}`}>{status.replaceAll("_", " ")}</span>
      </header>

      <div className="adminEnquiryMeta">
        {enquiry.email ? (
          <a href={`mailto:${enquiry.email}`}>
            <Mail size={14} /> {enquiry.email}
          </a>
        ) : null}
        {enquiry.phone ? (
          <a href={`tel:${enquiry.phone}`}>
            <Phone size={14} /> {enquiry.phone}
          </a>
        ) : null}
        {enquiry.instagram ? (
          <a
            href={`https://instagram.com/${enquiry.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <AtSign size={14} /> {enquiry.instagram}
          </a>
        ) : null}
        <span>
          Preferred artist: <strong>{enquiry.preferredArtist || "No preference"}</strong>
        </span>
        <span>
          Preferred date: <strong>{enquiry.preferredDate || "Flexible"}</strong>
        </span>
      </div>

      <p className="adminEnquiryBrief">{enquiry.concept}</p>

      {enquiry.referenceImages.length > 0 ? (
        <div className="adminEnquiryImages">
          <p>
            <Camera size={14} /> Uploaded reference images ({enquiry.referenceImages.length})
          </p>

          <div className="adminEnquiryImageGrid">
            {enquiry.referenceImages.map((image) => {
              const imageUrl = `/api/admin/enquiries/${enquiry.id}/images/${image.id}`;
              return <EnquiryReferenceThumb key={image.id} image={image} imageUrl={imageUrl} />;
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="adminEnquiryToggle"
        onClick={() => setIsActionsOpen((v) => !v)}
        aria-expanded={isActionsOpen}
      >
        {isActionsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isActionsOpen ? "Hide actions" : "Manage enquiry"}
      </button>

      {isActionsOpen ? (
        <>
          <form className="adminQuickBook" onSubmit={createBookingFromEnquiry}>
            <p>Schedule from enquiry</p>
            <div className="adminFieldRow">
              <label>
                Start
                <input
                  type="datetime-local"
                  value={quickStartAt}
                  onChange={(event) => setQuickStartAt(event.target.value)}
                  required
                />
              </label>
              <label>
                End
                <input
                  type="datetime-local"
                  value={quickEndAt}
                  onChange={(event) => setQuickEndAt(event.target.value)}
                  required
                />
              </label>
            </div>
            <button className="primaryButton" type="submit" disabled={isSaving}>
              <Plus size={14} /> Schedule booking
            </button>
          </form>

          <form className="adminFormStack" onSubmit={saveEnquiry}>
            <div className="adminFieldRow">
              <label>
                Status
                <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                  {enquiryStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Assigned artist
                <select
                  value={assignedArtistSlug}
                  onChange={(event) => setAssignedArtistSlug(event.target.value as ArtistSlug)}
                >
                  {artists.map((artist) => (
                    <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Internal notes
              <textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={3} />
            </label>

            <button className="ghostButton" type="submit" disabled={isSaving}>
              <Save size={14} /> Save enquiry details
            </button>
          </form>
        </>
      ) : null}

      {message ? (
        <p className={`adminNotice ${isError ? "adminNoticeError" : "adminNoticeSuccess"}`}>{message}</p>
      ) : null}
    </article>
  );
}

export function AdminDashboard({
  username,
  artists,
  initialEnquiries,
  initialBookings,
  initialWeeklyAvailability,
  initialTimeOff,
  initialGallery,
}: AdminDashboardProps) {
  const router = useRouter();

  const defaultArtistSlug: ArtistSlug = artists[0]?.slug || "sharnia";

  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [bookings, setBookings] = useState(sortBookings(initialBookings));
  const [weeklyRules, setWeeklyRules] = useState<WeeklyAvailabilityRule[]>(initialWeeklyAvailability);
  const [timeOff, setTimeOff] = useState<TimeOffPeriod[]>(sortTimeOff(initialTimeOff));
  const [activeArtist, setActiveArtist] = useState<ArtistSlug>(defaultArtistSlug);
  const [calendarArtist, setCalendarArtist] = useState<ArtistSlug | "all">("all");
  const [activeTab, setActiveTab] = useState<AdminTabKey>("enquiries");
  const [enquiryFilter, setEnquiryFilter] = useState<EnquiryFilter>("action");
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [manualBooking, setManualBooking] = useState<ManualBookingDraft>(
    defaultBookingDraft(defaultArtistSlug)
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [weeklyDrafts, setWeeklyDrafts] = useState<WeeklyRuleDraft[]>(() =>
    defaultWeeklyDraftsForArtist(initialWeeklyAvailability, defaultArtistSlug)
  );
  const [timeOffDraft, setTimeOffDraft] = useState<TimeOffDraft>(
    defaultTimeOffDraft(defaultArtistSlug)
  );
  const [availabilityNotice, setAvailabilityNotice] = useState<string | null>(null);
  const [availabilityNoticeIsError, setAvailabilityNoticeIsError] = useState(false);
  const [savingWeekday, setSavingWeekday] = useState<WeekdayIndex | null>(null);
  const [isSubmittingTimeOff, setIsSubmittingTimeOff] = useState(false);

  const pendingEnquiries = useMemo(
    () => enquiries.filter((item) => actionableEnquiryStatuses.has(item.status)).length,
    [enquiries]
  );

  const orderedEnquiries = useMemo(() => sortEnquiriesForAction(enquiries), [enquiries]);

  const visibleEnquiries = useMemo(() => {
    if (enquiryFilter === "all") {
      return orderedEnquiries;
    }

    if (enquiryFilter === "resolved") {
      return orderedEnquiries.filter((item) => !actionableEnquiryStatuses.has(item.status));
    }

    return orderedEnquiries.filter((item) => actionableEnquiryStatuses.has(item.status));
  }, [orderedEnquiries, enquiryFilter]);

  const calendarDays = useMemo(() => buildCalendarGrid(monthCursor), [monthCursor]);

  const artistNameBySlug = useMemo(() => {
    const map = new Map<ArtistSlug, string>();
    for (const artist of artists) map.set(artist.slug, artist.name);
    return map;
  }, [artists]);

  const calendarBookings = useMemo(
    () =>
      sortBookings(
        calendarArtist === "all"
          ? bookings
          : bookings.filter((booking) => booking.artistSlug === calendarArtist)
      ),
    [bookings, calendarArtist]
  );

  const activeArtistBookings = useMemo(
    () => sortBookings(bookings.filter((booking) => booking.artistSlug === activeArtist)),
    [bookings, activeArtist]
  );

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, AdminBooking[]>();

    for (const booking of calendarBookings) {
      const key = dayKey(new Date(booking.startAt));
      const current = map.get(key) || [];
      current.push(booking);
      current.sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
      map.set(key, current);
    }

    return map;
  }, [calendarBookings]);

  const calendarTimeOff = useMemo(
    () =>
      sortTimeOff(
        calendarArtist === "all"
          ? timeOff
          : timeOff.filter((period) => period.artistSlug === calendarArtist)
      ),
    [timeOff, calendarArtist]
  );

  const activeArtistTimeOff = useMemo(
    () => sortTimeOff(timeOff.filter((period) => period.artistSlug === activeArtist)),
    [timeOff, activeArtist]
  );

  const upcomingTimeOff = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return activeArtistTimeOff.filter((period) => Date.parse(period.endAt) >= cutoff);
  }, [activeArtistTimeOff]);

  const calendarWeeklyRulesByDay = useMemo(() => {
    if (calendarArtist === "all") return null;
    const map = new Map<WeekdayIndex, WeeklyAvailabilityRule>();
    for (const rule of weeklyRules) {
      if (rule.artistSlug !== calendarArtist || !rule.enabled) continue;
      map.set(rule.weekday, rule);
    }
    return map;
  }, [weeklyRules, calendarArtist]);

  const activeArtistWeeklyRulesByDay = useMemo(() => {
    const map = new Map<WeekdayIndex, WeeklyAvailabilityRule>();
    for (const rule of weeklyRules) {
      if (rule.artistSlug !== activeArtist || !rule.enabled) continue;
      map.set(rule.weekday, rule);
    }
    return map;
  }, [weeklyRules, activeArtist]);

  const dayStatusByKey = useMemo(() => {
    const map = new Map<
      string,
      { status: AvailabilityStatus | "off" | "none"; window: { startAt: string; endAt: string } | null }
    >();

    if (!calendarWeeklyRulesByDay) return map;

    for (const cell of calendarDays) {
      const weekday = cell.date.getDay() as WeekdayIndex;
      const rule = calendarWeeklyRulesByDay.get(weekday);
      map.set(
        dayKey(cell.date),
        resolveDayStatus(cell.date, rule, calendarTimeOff, calendarBookings)
      );
    }

    return map;
  }, [calendarDays, calendarWeeklyRulesByDay, calendarTimeOff, calendarBookings]);

  const artistSessionMetrics = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();
    const today = dayKey(now);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayCount = calendarBookings.filter((booking) => dayKey(new Date(booking.startAt)) === today).length;

    const nextSevenDaysCount = calendarBookings.filter((booking) => {
      const start = Date.parse(booking.startAt);
      return start >= nowMs && start <= nextWeek.getTime() && booking.status === "scheduled";
    }).length;

    const cancelledCount = calendarBookings.filter((booking) => booking.status === "cancelled").length;

    const upcoming = calendarBookings
      .filter((booking) => Date.parse(booking.endAt) >= nowMs)
      .slice(0, 12);

    return {
      todayCount,
      nextSevenDaysCount,
      cancelledCount,
      upcoming,
    };
  }, [calendarBookings]);

  const availabilityMetrics = useMemo(() => {
    let free = 0;
    let booked = 0;
    let off = 0;
    const horizon = new Date();
    horizon.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const date = new Date(horizon);
      date.setDate(date.getDate() + i);
      const weekday = date.getDay() as WeekdayIndex;
      const rule = activeArtistWeeklyRulesByDay.get(weekday);
      if (!rule) continue;
      const { status } = resolveDayStatus(date, rule, activeArtistTimeOff, activeArtistBookings);
      if (status === "free") free++;
      else if (status === "booked") booked++;
      else if (status === "off") off++;
    }

    return { freeCount: free, bookedCount: booked, offCount: off };
  }, [activeArtistWeeklyRulesByDay, activeArtistTimeOff, activeArtistBookings]);

  const activeArtistLabel = useMemo(
    () => artists.find((artist) => artist.slug === activeArtist)?.name || "Selected artist",
    [artists, activeArtist]
  );

  const calendarArtistLabel = useMemo(() => {
    if (calendarArtist === "all") return "All artists";
    return artistNameBySlug.get(calendarArtist) || "Selected artist";
  }, [calendarArtist, artistNameBySlug]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function updateEnquiryInState(updated: AdminEnquiry) {
    setEnquiries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  function addBookingToState(booking: AdminBooking) {
    setBookings((current) => sortBookings([...current, booking]));
  }

  function updateBookingInState(updated: AdminBooking) {
    setBookings((current) =>
      sortBookings(current.map((booking) => (booking.id === updated.id ? updated : booking)))
    );
  }

  function switchActiveArtist(next: ArtistSlug) {
    setActiveArtist(next);
    setManualBooking((current) => ({ ...current, artistSlug: next }));
    setTimeOffDraft((current) => ({ ...current, artistSlug: next }));
    setWeeklyDrafts(defaultWeeklyDraftsForArtist(weeklyRules, next));
  }

  async function handleSaveWeeklyRule(weekday: WeekdayIndex) {
    const draft = weeklyDrafts.find((entry) => entry.weekday === weekday);
    if (!draft) return;

    setAvailabilityNotice(null);
    setAvailabilityNoticeIsError(false);
    setSavingWeekday(weekday);

    try {
      const response = await fetch("/api/admin/availability/weekly", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistSlug: activeArtist,
          weekday: draft.weekday,
          startTime: draft.startTime,
          endTime: draft.endTime,
          enabled: draft.enabled,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { rule?: WeeklyAvailabilityRule; error?: string }
        | null;

      if (!response.ok || !payload?.rule) {
        throw new Error(payload?.error || "Could not save weekday.");
      }

      setWeeklyRules((current) => {
        const filtered = current.filter(
          (rule) => !(rule.artistSlug === payload.rule!.artistSlug && rule.weekday === payload.rule!.weekday)
        );
        return [...filtered, payload.rule!];
      });
      setAvailabilityNotice(`${weekdayLabels[weekday]} saved.`);
    } catch (error) {
      setAvailabilityNoticeIsError(true);
      setAvailabilityNotice(error instanceof Error ? error.message : "Could not save weekday.");
    } finally {
      setSavingWeekday(null);
    }
  }

  async function handleCreateTimeOff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAvailabilityNotice(null);
    setAvailabilityNoticeIsError(false);
    setIsSubmittingTimeOff(true);

    try {
      const response = await fetch("/api/admin/availability/time-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeOffDraft),
      });

      const payload = (await response.json().catch(() => null)) as
        | { period?: TimeOffPeriod; error?: string }
        | null;

      if (!response.ok || !payload?.period) {
        throw new Error(payload?.error || "Could not add time-off.");
      }

      setTimeOff((current) => sortTimeOff([...current, payload.period!]));
      setTimeOffDraft(defaultTimeOffDraft(timeOffDraft.artistSlug));
      setAvailabilityNotice("Time-off added.");
    } catch (error) {
      setAvailabilityNoticeIsError(true);
      setAvailabilityNotice(error instanceof Error ? error.message : "Could not add time-off.");
    } finally {
      setIsSubmittingTimeOff(false);
    }
  }

  async function handleDeleteTimeOff(id: number) {
    setAvailabilityNotice(null);
    setAvailabilityNoticeIsError(false);

    try {
      const response = await fetch(`/api/admin/availability/time-off/${id}`, {
        method: "DELETE",
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not remove time-off.");
      }

      setTimeOff((current) => current.filter((period) => period.id !== id));
      setAvailabilityNotice("Time-off removed.");
    } catch (error) {
      setAvailabilityNoticeIsError(true);
      setAvailabilityNotice(error instanceof Error ? error.message : "Could not remove time-off.");
    }
  }

  async function handleManualBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setNoticeIsError(false);
    setIsSubmittingBooking(true);

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualBooking),
      });

      const payload = (await response.json().catch(() => null)) as
        | { booking?: AdminBooking; error?: string }
        | null;

      if (!response.ok || !payload?.booking) {
        throw new Error(payload?.error || "Could not add booking.");
      }

      addBookingToState(payload.booking);
      setNotice("Booking added to calendar.");
      setManualBooking(defaultBookingDraft(manualBooking.artistSlug));
    } catch (error) {
      setNoticeIsError(true);
      setNotice(error instanceof Error ? error.message : "Could not add booking.");
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  return (
    <div className="adminDashboard">
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Artist operations dashboard</h1>
          <p>Signed in as {username}</p>
        </div>

        <button type="button" className="ghostButton" onClick={handleLogout}>
          <LogOut size={14} /> Log out
        </button>
      </header>

      <section className="adminStatsGrid">
        <article>
          <p>Incoming enquiries</p>
          <strong>{pendingEnquiries}</strong>
        </article>
        <article>
          <p>{calendarArtistLabel} today</p>
          <strong>{artistSessionMetrics.todayCount}</strong>
        </article>
        <article>
          <p>Next 7 days scheduled</p>
          <strong>{artistSessionMetrics.nextSevenDaysCount}</strong>
        </article>
      </section>

      <nav className="adminTabs" role="tablist" aria-label="Admin sections">
        {(
          [
            { key: "enquiries", label: "Enquiries", icon: Mail },
            { key: "calendar", label: "Calendar", icon: CalendarDays },
            { key: "availability", label: "Availability", icon: Clock3 },
            { key: "gallery", label: "Galleries", icon: Images },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`adminTabBtn${activeTab === tab.key ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </nav>
      {activeTab === "enquiries" ? (
        <section className="adminTabPanel">
          <div className="adminPanel">
            <header className="adminPanelHeader adminPanelHeader--stacked">
              <div>
                <h2>Incoming enquiries</h2>
                <span>{visibleEnquiries.length} shown</span>
              </div>

              <div className="adminEnquiryFilters" role="tablist" aria-label="Enquiry filters">
                {[
                  { key: "action", label: "Action queue" },
                  { key: "all", label: "All" },
                  { key: "resolved", label: "Resolved" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`adminFilterBtn${enquiryFilter === filter.key ? " is-active" : ""}`}
                    onClick={() => setEnquiryFilter(filter.key as EnquiryFilter)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </header>

            <div className="adminEnquiryList">
              {visibleEnquiries.length === 0 ? (
                <p className="adminEmptyState">No enquiries in this view.</p>
              ) : (
                visibleEnquiries.map((enquiry) => (
                  <EnquiryCard
                    key={enquiry.id}
                    enquiry={enquiry}
                    artists={artists}
                    onUpdated={updateEnquiryInState}
                    onBookingCreated={addBookingToState}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "calendar" ? (
        <section className="adminTabPanel">
          <div className="adminPanel">
            <header className="adminPanelHeader">
              <h2>
                <CalendarDays size={16} /> Artist calendar
              </h2>
              <label>
                Artist
                <select
                  value={calendarArtist}
                  onChange={(event) =>
                    setCalendarArtist(event.target.value as ArtistSlug | "all")
                  }
                >
                  <option value="all">All artists</option>
                  {artists.map((artist) => (
                    <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>
            </header>

            <div className="adminArtistSummary" aria-label="Selected artist session summary">
              <span>{artistSessionMetrics.todayCount} today</span>
              <span>{artistSessionMetrics.nextSevenDaysCount} upcoming this week</span>
              <span>{artistSessionMetrics.cancelledCount} cancelled</span>
              {calendarArtist !== "all" ? (
                <>
                  <span>{availabilityMetrics.freeCount} free days (60d)</span>
                  <span>{availabilityMetrics.bookedCount} booked days (60d)</span>
                  <span>{availabilityMetrics.offCount} time-off days (60d)</span>
                </>
              ) : null}
            </div>

            <div className="adminCalendarNav">
              <button
                type="button"
                className="ghostButton"
                onClick={() =>
                  setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                }
              >
                Previous
              </button>
              <strong>{monthTitle(monthCursor)}</strong>
              <button
                type="button"
                className="ghostButton"
                onClick={() =>
                  setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
                }
              >
                Next
              </button>
            </div>

            <div className="adminCalendarGrid" role="grid" aria-label="Artist booking calendar">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                <div key={label} className="adminCalendarHeadCell">
                  {label}
                </div>
              ))}

              {calendarDays.map((cell) => {
                const key = dayKey(cell.date);
                const entries = bookingsByDay.get(key) || [];
                const dayStatus = dayStatusByKey.get(key)?.status || "none";

                return (
                  <div
                    key={cell.date.toISOString()}
                    className={`adminCalendarCell${cell.inCurrentMonth ? "" : " is-dim"}`}
                  >
                    <p className="adminCalendarDate">{cell.date.getDate()}</p>
                    {dayStatus !== "none" ? (
                      <div className="adminCalendarAvailabilityBadges">
                        <span className={`adminAvailabilityTag adminAvailabilityTag--${dayStatus}`}>
                          {dayStatus === "free"
                            ? "Free"
                            : dayStatus === "booked"
                              ? "Booked"
                              : "Off"}
                        </span>
                      </div>
                    ) : null}
                    <div className="adminCalendarBookings">
                      {entries.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          artistLabel={
                            calendarArtist === "all"
                              ? artistNameBySlug.get(booking.artistSlug) ?? null
                              : null
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="adminUpcomingSection">
              <h3>Upcoming sessions for {calendarArtistLabel}</h3>
              <div className="adminUpcomingList">
                {artistSessionMetrics.upcoming.length === 0 ? (
                  <p className="adminEmptyState">No upcoming bookings for this artist.</p>
                ) : (
                  artistSessionMetrics.upcoming.map((booking) => (
                    <ArtistBookingItem
                      key={booking.id}
                      booking={booking}
                      onUpdated={updateBookingInState}
                      artistLabel={
                        calendarArtist === "all"
                          ? artistNameBySlug.get(booking.artistSlug) ?? null
                          : null
                      }
                    />
                  ))
                )}
              </div>
            </section>

            <form className="adminBookingForm" onSubmit={handleManualBookingSubmit}>
              <h3>Add manual booking</h3>
              <label>
                Artist
                <select
                  value={manualBooking.artistSlug}
                  onChange={(event) =>
                    setManualBooking((current) => ({
                      ...current,
                      artistSlug: event.target.value as ArtistSlug,
                    }))
                  }
                >
                  {artists.map((artist) => (
                    <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="adminFieldRow">
                <label>
                  Client name
                  <input
                    required
                    value={manualBooking.clientName}
                    onChange={(event) =>
                      setManualBooking((current) => ({ ...current, clientName: event.target.value }))
                    }
                  />
                </label>

                <label>
                  Client email
                  <input
                    required
                    type="email"
                    value={manualBooking.clientEmail}
                    onChange={(event) =>
                      setManualBooking((current) => ({ ...current, clientEmail: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="adminFieldRow">
                <label>
                  Start
                  <input
                    required
                    type="datetime-local"
                    value={manualBooking.startAt}
                    onChange={(event) =>
                      setManualBooking((current) => ({ ...current, startAt: event.target.value }))
                    }
                  />
                </label>

                <label>
                  End
                  <input
                    required
                    type="datetime-local"
                    value={manualBooking.endAt}
                    onChange={(event) =>
                      setManualBooking((current) => ({ ...current, endAt: event.target.value }))
                    }
                  />
                </label>
              </div>

              <label>
                Notes
                <textarea
                  rows={3}
                  value={manualBooking.notes}
                  onChange={(event) =>
                    setManualBooking((current) => ({ ...current, notes: event.target.value }))
                  }
                />
              </label>

              <button className="primaryButton" type="submit" disabled={isSubmittingBooking}>
                <Plus size={14} /> {isSubmittingBooking ? "Adding booking..." : "Add booking"}
              </button>

              {notice ? (
                <p className={`adminNotice ${noticeIsError ? "adminNoticeError" : "adminNoticeSuccess"}`}>
                  {notice}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      ) : null}

      {activeTab === "availability" ? (
        <section className="adminTabPanel">
          <div className="adminPanel">
            <header className="adminPanelHeader">
              <h2>
                <Clock3 size={16} /> Weekly availability
              </h2>
              <label>
                Artist
                <select
                  value={activeArtist}
                  onChange={(event) => switchActiveArtist(event.target.value as ArtistSlug)}
                >
                  {artists.map((artist) => (
                    <option key={artist.slug} value={artist.slug}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>
            </header>

            <p className="adminEmptyState" style={{ textAlign: "left", padding: "0.25rem 0" }}>
              Set the recurring weekly schedule for {activeArtistLabel}. Time-off below overrides any
              overlapping day window.
            </p>

            <div className="adminWeeklyEditor">
              {[1, 2, 3, 4, 5, 6, 0].map((weekdayIndex) => {
                const weekday = weekdayIndex as WeekdayIndex;
                const draft = weeklyDrafts.find((entry) => entry.weekday === weekday);
                if (!draft) return null;
                const isSaving = savingWeekday === weekday;
                return (
                  <div
                    key={weekday}
                    className={`adminWeeklyRow${draft.enabled ? "" : " is-disabled"}`}
                  >
                    <div className="adminWeeklyRow__title">
                      <label>
                        <input
                          type="checkbox"
                          checked={draft.enabled}
                          onChange={(event) =>
                            setWeeklyDrafts((current) =>
                              current.map((entry) =>
                                entry.weekday === weekday
                                  ? { ...entry, enabled: event.target.checked }
                                  : entry
                              )
                            )
                          }
                        />
                        <strong>{weekdayLabels[weekday]}</strong>
                      </label>
                    </div>

                    <div className="adminWeeklyRow__times">
                      <label>
                        Start
                        <input
                          type="time"
                          value={draft.startTime}
                          disabled={!draft.enabled}
                          onChange={(event) =>
                            setWeeklyDrafts((current) =>
                              current.map((entry) =>
                                entry.weekday === weekday
                                  ? { ...entry, startTime: event.target.value }
                                  : entry
                              )
                            )
                          }
                        />
                      </label>
                      <label>
                        End
                        <input
                          type="time"
                          value={draft.endTime}
                          disabled={!draft.enabled}
                          onChange={(event) =>
                            setWeeklyDrafts((current) =>
                              current.map((entry) =>
                                entry.weekday === weekday
                                  ? { ...entry, endTime: event.target.value }
                                  : entry
                              )
                            )
                          }
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="ghostButton"
                      disabled={isSaving}
                      onClick={() => void handleSaveWeeklyRule(weekday)}
                    >
                      <Save size={14} /> {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                );
              })}
            </div>

            <section className="adminUpcomingSection">
              <h3>
                <CalendarOff size={16} style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Time off &amp; overrides
              </h3>

              <form className="adminTimeOffForm" onSubmit={handleCreateTimeOff}>
                <div className="adminFieldRow">
                  <label>
                    Start
                    <input
                      type="datetime-local"
                      required
                      value={timeOffDraft.startAt}
                      onChange={(event) =>
                        setTimeOffDraft((current) => ({ ...current, startAt: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    End
                    <input
                      type="datetime-local"
                      required
                      value={timeOffDraft.endAt}
                      onChange={(event) =>
                        setTimeOffDraft((current) => ({ ...current, endAt: event.target.value }))
                      }
                    />
                  </label>
                </div>

                <label>
                  Reason
                  <input
                    placeholder="Holiday, sick day, training..."
                    value={timeOffDraft.reason}
                    onChange={(event) =>
                      setTimeOffDraft((current) => ({ ...current, reason: event.target.value }))
                    }
                  />
                </label>

                <button className="primaryButton" type="submit" disabled={isSubmittingTimeOff}>
                  <Plus size={14} /> {isSubmittingTimeOff ? "Saving..." : "Add time off"}
                </button>
              </form>

              {availabilityNotice ? (
                <p
                  className={`adminNotice ${
                    availabilityNoticeIsError ? "adminNoticeError" : "adminNoticeSuccess"
                  }`}
                >
                  {availabilityNotice}
                </p>
              ) : null}

              <div className="adminTimeOffList">
                {upcomingTimeOff.length === 0 ? (
                  <p className="adminEmptyState">No upcoming time off booked.</p>
                ) : (
                  upcomingTimeOff.map((period) => (
                    <article key={period.id} className="adminTimeOffItem">
                      <div>
                        <strong>
                          {formatDateOnly(period.startAt)} &rarr; {formatDateOnly(period.endAt)}
                        </strong>
                        <p>
                          {formatTime(period.startAt)} - {formatTime(period.endAt)}
                          {period.reason ? ` - ${period.reason}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="ghostButton"
                        onClick={() => void handleDeleteTimeOff(period.id)}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      ) : null}

      {activeTab === "gallery" ? (
        <section className="adminTabPanel">
          <GalleryManager
            artists={artists}
            initialGallery={initialGallery}
          />
        </section>
      ) : null}
    </div>
  );
}

const GALLERY_MAX_BYTES = 8 * 1024 * 1024;
const GALLERY_ACCEPT_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected file reader result"));
        return;
      }
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

function readImageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth || null, height: image.naturalHeight || null });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: null, height: null });
    };
    image.src = url;
  });
}

function sortGallery(list: GalleryImage[]): GalleryImage[] {
  return [...list].sort((a, b) => {
    if (a.artistSlug !== b.artistSlug) return a.artistSlug.localeCompare(b.artistSlug);
    if (a.position !== b.position) return a.position - b.position;
    return a.id - b.id;
  });
}

function GalleryManager({
  artists,
  initialGallery,
}: {
  artists: ArtistAdminOption[];
  initialGallery: GalleryImage[];
}) {
  const defaultArtistSlug: ArtistSlug = artists[0]?.slug || "sharnia";
  const [activeArtist, setActiveArtist] = useState<ArtistSlug>(defaultArtistSlug);
  const [gallery, setGallery] = useState<GalleryImage[]>(sortGallery(initialGallery));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const visibleImages = useMemo(
    () => gallery.filter((image) => image.artistSlug === activeArtist),
    [gallery, activeArtist]
  );

  const countsByArtist = useMemo(() => {
    const counts = new Map<ArtistSlug, number>();
    for (const image of gallery) {
      counts.set(image.artistSlug, (counts.get(image.artistSlug) ?? 0) + 1);
    }
    return counts;
  }, [gallery]);

  function replaceGalleryForArtist(next: GalleryImage[], slug: ArtistSlug) {
    setGallery((current) => {
      const others = current.filter((image) => image.artistSlug !== slug);
      return sortGallery([...others, ...next]);
    });
  }

  function reportError(error: unknown, fallback: string) {
    setNoticeIsError(true);
    setNotice(error instanceof Error ? error.message : fallback);
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploading(true);
    setUploadProgress({ done: 0, total: fileList.length });
    setNotice(null);
    setNoticeIsError(false);

    let uploadedCount = 0;
    let firstError: string | null = null;

    for (const file of fileList) {
      try {
        const mimeType = (file.type || "").toLowerCase();
        if (!GALLERY_ACCEPT_MIME.has(mimeType)) {
          throw new Error(`${file.name}: unsupported file type.`);
        }
        if (file.size > GALLERY_MAX_BYTES) {
          throw new Error(`${file.name}: larger than 8MB. Please resize and retry.`);
        }

        const [base64Data, dimensions] = await Promise.all([
          readFileAsBase64(file),
          readImageDimensions(file),
        ]);

        const response = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artistSlug: activeArtist,
            alt: "",
            mimeType,
            byteSize: file.size,
            base64Data,
            width: dimensions.width,
            height: dimensions.height,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { image?: GalleryImage; error?: string }
          | null;

        if (!response.ok || !payload?.image) {
          throw new Error(payload?.error || `${file.name}: upload failed.`);
        }

        setGallery((current) => sortGallery([...current, payload.image!]));
        uploadedCount += 1;
      } catch (error) {
        if (!firstError) {
          firstError = error instanceof Error ? error.message : "Upload failed.";
        }
      } finally {
        setUploadProgress((current) => ({ ...current, done: current.done + 1 }));
      }
    }

    setIsUploading(false);
    setUploadProgress({ done: 0, total: 0 });

    if (firstError) {
      setNoticeIsError(true);
      setNotice(
        uploadedCount > 0
          ? `${uploadedCount} uploaded, but some failed: ${firstError}`
          : firstError
      );
    } else {
      setNoticeIsError(false);
      setNotice(`${uploadedCount} image${uploadedCount === 1 ? "" : "s"} uploaded.`);
    }
  }

  async function handleDelete(imageId: number) {
    if (typeof window !== "undefined" && !window.confirm("Delete this image?")) {
      return;
    }

    setBusyId(imageId);
    setNotice(null);
    setNoticeIsError(false);

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not delete image.");
      }
      setGallery((current) => current.filter((image) => image.id !== imageId));
      setNotice("Image removed.");
    } catch (error) {
      reportError(error, "Could not delete image.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(imageId: number, direction: -1 | 1) {
    const current = [...visibleImages];
    const index = current.findIndex((image) => image.id === imageId);
    if (index < 0) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.length) return;

    const swapped = [...current];
    [swapped[index], swapped[nextIndex]] = [swapped[nextIndex], swapped[index]];
    const orderedIds = swapped.map((image) => image.id);

    replaceGalleryForArtist(
      swapped.map((image, position) => ({ ...image, position })),
      activeArtist
    );

    setBusyId(imageId);
    setNotice(null);
    setNoticeIsError(false);

    try {
      const response = await fetch("/api/admin/gallery/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: activeArtist, orderedIds }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { gallery?: GalleryImage[]; error?: string }
        | null;
      if (!response.ok || !payload?.gallery) {
        throw new Error(payload?.error || "Could not reorder gallery.");
      }
      replaceGalleryForArtist(payload.gallery, activeArtist);
    } catch (error) {
      reportError(error, "Could not reorder gallery.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReassign(imageId: number, nextSlug: ArtistSlug) {
    setBusyId(imageId);
    setNotice(null);
    setNoticeIsError(false);

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: nextSlug }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { image?: GalleryImage; error?: string }
        | null;
      if (!response.ok || !payload?.image) {
        throw new Error(payload?.error || "Could not reassign image.");
      }
      setGallery((current) =>
        sortGallery(
          current.map((entry) => (entry.id === imageId ? payload.image! : entry))
        )
      );
      setNotice(`Moved to ${artists.find((a) => a.slug === nextSlug)?.name || nextSlug}.`);
    } catch (error) {
      reportError(error, "Could not reassign image.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetFeatured(imageId: number) {
    setBusyId(imageId);
    setNotice(null);
    setNoticeIsError(false);

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: true }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { image?: GalleryImage; error?: string }
        | null;
      if (!response.ok || !payload?.image) {
        throw new Error(payload?.error || "Could not set featured image.");
      }
      setGallery((current) =>
        current.map((entry) =>
          entry.artistSlug === activeArtist
            ? { ...entry, featured: entry.id === imageId }
            : entry
        )
      );
      setNotice("Featured image updated. It now appears on the artist cards and navigation.");
    } catch (error) {
      reportError(error, "Could not set featured image.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="adminPanel">
      <header className="adminPanelHeader adminPanelHeader--stacked">
        <div>
          <h2>
            <Images size={16} /> Artist galleries
          </h2>
          <span>Upload, reorder or reassign the images shown on each artist page.</span>
        </div>

        <div className="adminEnquiryFilters" role="tablist" aria-label="Gallery artist">
          {artists.map((artist) => (
            <button
              key={artist.slug}
              type="button"
              className={`adminFilterBtn${activeArtist === artist.slug ? " is-active" : ""}`}
              onClick={() => setActiveArtist(artist.slug)}
            >
              {artist.name}
              <span className="adminGalleryCount">{countsByArtist.get(artist.slug) ?? 0}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="adminGalleryUpload">
        <label className={`adminGalleryDropzone${isUploading ? " is-busy" : ""}`}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            multiple
            disabled={isUploading}
            onChange={(event) => {
              void handleFilesSelected(event.target.files);
              event.target.value = "";
            }}
            style={{ display: "none" }}
          />
          <Upload size={16} />
          <span>
            {isUploading
              ? `Uploading ${uploadProgress.done} / ${uploadProgress.total}...`
              : `Click or drop JPG / PNG / WebP / AVIF images (max 8MB each) to add to ${
                  artists.find((a) => a.slug === activeArtist)?.name || activeArtist
                }`}
          </span>
        </label>
      </div>

      {notice ? (
        <p className={`adminNotice ${noticeIsError ? "adminNoticeError" : "adminNoticeSuccess"}`}>
          {notice}
        </p>
      ) : null}

      {visibleImages.length === 0 ? (
        <p className="adminEmptyState">
          No custom gallery images for this artist yet. The website will fall back to the crawled
          archive until you upload some.
        </p>
      ) : (
        <div className="adminGalleryGrid">
          {visibleImages.map((image, index) => (
            <article key={image.id} className="adminGalleryCard">
              <div className="adminGalleryThumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/gallery/${image.id}`}
                  alt={`${artists.find((artist) => artist.slug === image.artistSlug)?.name || "Artist"} tattoo`}
                  loading="lazy"
                />
              </div>
              <div className="adminGalleryMeta">
                <div className="adminGalleryMetaRow">
                  <span className="adminGalleryPosition">
                    #{index + 1}
                    {image.width && image.height ? ` · ${image.width}×${image.height}` : ""}
                  </span>
                  <select
                    value={image.artistSlug}
                    disabled={busyId === image.id}
                    onChange={(event) =>
                      void handleReassign(image.id, event.target.value as ArtistSlug)
                    }
                  >
                    {artists.map((artist) => (
                      <option key={artist.slug} value={artist.slug}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adminGalleryActions">
                  <button
                    type="button"
                    className={`ghostButton adminGalleryFeature${image.featured ? " is-featured" : ""}`}
                    disabled={busyId === image.id || image.featured}
                    onClick={() => void handleSetFeatured(image.id)}
                    aria-label={image.featured ? "Featured image" : "Set as featured image"}
                    title={image.featured ? "Featured image" : "Set as featured image"}
                  >
                    <Star size={14} fill={image.featured ? "currentColor" : "none"} />
                    {image.featured ? "Featured" : "Feature"}
                  </button>
                  <button
                    type="button"
                    className="ghostButton"
                    disabled={busyId === image.id || index === 0}
                    onClick={() => void handleMove(image.id, -1)}
                    aria-label="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="ghostButton"
                    disabled={busyId === image.id || index === visibleImages.length - 1}
                    onClick={() => void handleMove(image.id, 1)}
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="ghostButton adminGalleryDelete"
                    disabled={busyId === image.id}
                    onClick={() => void handleDelete(image.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
