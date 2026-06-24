import { neon } from "@neondatabase/serverless";
import { artists } from "@/content/studio";
import type { ArtistSlug } from "@/content/studio";
import {
  bookingStatuses,
  enquiryStatuses,
  type AdminBooking,
  type AdminEnquiry,
  type AvailabilityWindow,
  type BookingStatus,
  type CreateBookingInput,
  type CreateEnquiryInput,
  type CreateTimeOffInput,
  type EnquiryStatus,
  type TimeOffPeriod,
  type UpdateBookingInput,
  type UpdateEnquiryInput,
  type UpsertWeeklyRuleInput,
  type WeekdayIndex,
  type WeeklyAvailabilityRule,
} from "@/lib/admin-types";

type EnquiryRow = {
  id: number;
  created_at: string | Date;
  updated_at: string | Date;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  pronouns: string | null;
  date_of_birth: string | null;
  preferred_date: string | null;
  availability_window: string | null;
  budget_range: string | null;
  preferred_artist: string | null;
  assigned_artist_slug: ArtistSlug | null;
  is_cover_up: boolean;
  style_direction: string;
  size_and_placement: string;
  reference_links: string | null;
  medical_notes: string | null;
  concept: string;
  status: EnquiryStatus;
  admin_notes: string | null;
};

type BookingRow = {
  id: number;
  created_at: string | Date;
  updated_at: string | Date;
  enquiry_id: number | null;
  artist_slug: ArtistSlug;
  client_name: string;
  client_email: string;
  start_at: string | Date;
  end_at: string | Date;
  status: string;
  notes: string | null;
};

type WeeklyRuleRow = {
  id: number;
  artist_slug: ArtistSlug;
  weekday: number;
  start_time: string;
  end_time: string;
  enabled: boolean;
  updated_at: string | Date;
};

type TimeOffRow = {
  id: number;
  created_at: string | Date;
  artist_slug: ArtistSlug;
  start_at: string | Date;
  end_at: string | Date;
  reason: string | null;
};

const artistSlugs = new Set(artists.map((artist) => artist.slug));

let sqlClient: ReturnType<typeof neon> | null = null;

function getSqlClient(): ReturnType<typeof neon> {
  if (sqlClient) {
    return sqlClient;
  }

  const databaseUrl =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Database connection missing. Set DATABASE_URL (or POSTGRES_URL) to enable admin bookings and enquiries."
    );
  }

  sqlClient = neon(databaseUrl);
  return sqlClient;
}

let schemaInitPromise: Promise<void> | null = null;

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() || "";
}

function mapEnquiry(row: EnquiryRow): AdminEnquiry {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    firstName: row.first_name,
    lastName: row.last_name,
    email: normalizeText(row.email),
    phone: normalizeText(row.phone),
    instagram: normalizeText(row.instagram),
    pronouns: normalizeText(row.pronouns),
    dateOfBirth: normalizeText(row.date_of_birth),
    preferredDate: normalizeText(row.preferred_date),
    availabilityWindow: normalizeText(row.availability_window),
    budgetRange: normalizeText(row.budget_range),
    preferredArtist: normalizeText(row.preferred_artist),
    assignedArtistSlug: row.assigned_artist_slug,
    isCoverUp: row.is_cover_up,
    styleDirection: row.style_direction,
    sizeAndPlacement: row.size_and_placement,
    referenceLinks: normalizeText(row.reference_links),
    medicalNotes: normalizeText(row.medical_notes),
    concept: row.concept,
    status: row.status,
    adminNotes: normalizeText(row.admin_notes),
  };
}

function mapBooking(row: BookingRow): AdminBooking {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    enquiryId: row.enquiry_id,
    artistSlug: row.artist_slug,
    clientName: row.client_name,
    clientEmail: row.client_email,
    startAt: toIso(row.start_at),
    endAt: toIso(row.end_at),
    status: normalizeBookingStatus(row.status),
    notes: normalizeText(row.notes),
  };
}

function ensureWeekday(value: number): WeekdayIndex {
  if (!Number.isInteger(value) || value < 0 || value > 6) {
    throw new Error("Weekday must be an integer between 0 (Sunday) and 6 (Saturday)");
  }

  return value as WeekdayIndex;
}

function ensureClockTime(value: string): string {
  const trimmed = value.trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    throw new Error("Time must be in HH:MM (24h) format");
  }

  return trimmed;
}

function mapWeeklyRule(row: WeeklyRuleRow): WeeklyAvailabilityRule {
  return {
    artistSlug: row.artist_slug,
    weekday: ensureWeekday(row.weekday),
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    enabled: row.enabled,
    updatedAt: toIso(row.updated_at),
  };
}

function mapTimeOff(row: TimeOffRow): TimeOffPeriod {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    artistSlug: row.artist_slug,
    startAt: toIso(row.start_at),
    endAt: toIso(row.end_at),
    reason: normalizeText(row.reason),
  };
}

function rangesOverlap(
  rangeA: { startAt: string; endAt: string },
  rangeB: { startAt: string; endAt: string }
): boolean {
  return Date.parse(rangeA.startAt) < Date.parse(rangeB.endAt) && Date.parse(rangeA.endAt) > Date.parse(rangeB.startAt);
}

function ensureArtistSlug(slug: string): ArtistSlug {
  if (artistSlugs.has(slug as ArtistSlug)) {
    return slug as ArtistSlug;
  }

  throw new Error("Unknown artist slug");
}

function ensureEnquiryStatus(status: string): EnquiryStatus {
  if (enquiryStatuses.includes(status as EnquiryStatus)) {
    return status as EnquiryStatus;
  }

  throw new Error("Unknown enquiry status");
}

function ensureBookingStatus(status: string): BookingStatus {
  if (bookingStatuses.includes(status as BookingStatus)) {
    return status as BookingStatus;
  }

  throw new Error("Unknown booking status");
}

function normalizeBookingStatus(status: string | null | undefined): BookingStatus {
  if (status && bookingStatuses.includes(status as BookingStatus)) {
    return status as BookingStatus;
  }

  return "scheduled";
}

export async function ensureAdminSchema(): Promise<void> {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      const sql = getSqlClient();

      await sql`
        CREATE TABLE IF NOT EXISTS admin_enquiries (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          instagram TEXT,
          pronouns TEXT,
          date_of_birth TEXT,
          preferred_date TEXT,
          availability_window TEXT,
          budget_range TEXT,
          preferred_artist TEXT,
          assigned_artist_slug TEXT,
          is_cover_up BOOLEAN NOT NULL DEFAULT FALSE,
          style_direction TEXT NOT NULL,
          size_and_placement TEXT NOT NULL,
          reference_links TEXT,
          medical_notes TEXT,
          concept TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          admin_notes TEXT
        );
      `;

      await sql`
        ALTER TABLE admin_enquiries
        ADD COLUMN IF NOT EXISTS instagram TEXT;
      `;

      await sql`
        ALTER TABLE admin_enquiries
        ALTER COLUMN email DROP NOT NULL;
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_bookings (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          enquiry_id INTEGER REFERENCES admin_enquiries(id) ON DELETE SET NULL,
          artist_slug TEXT NOT NULL,
          client_name TEXT NOT NULL,
          client_email TEXT NOT NULL,
          start_at TIMESTAMPTZ NOT NULL,
          end_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL DEFAULT 'scheduled',
          notes TEXT
        );
      `;

      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'admin_bookings_valid_window'
          ) THEN
            ALTER TABLE admin_bookings
            ADD CONSTRAINT admin_bookings_valid_window CHECK (end_at > start_at);
          END IF;
        END
        $$;
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_artist_weekly_availability (
          id SERIAL PRIMARY KEY,
          artist_slug TEXT NOT NULL,
          weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          enabled BOOLEAN NOT NULL DEFAULT TRUE,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (artist_slug, weekday)
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_artist_time_off (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          artist_slug TEXT NOT NULL,
          start_at TIMESTAMPTZ NOT NULL,
          end_at TIMESTAMPTZ NOT NULL,
          reason TEXT
        );
      `;

      await sql`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'admin_artist_time_off_valid_window'
          ) THEN
            ALTER TABLE admin_artist_time_off
            ADD CONSTRAINT admin_artist_time_off_valid_window CHECK (end_at > start_at);
          END IF;
        END
        $$;
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_admin_enquiries_created
        ON admin_enquiries(created_at DESC);
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_admin_bookings_artist_start
        ON admin_bookings(artist_slug, start_at);
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS idx_admin_artist_time_off_artist_start
        ON admin_artist_time_off(artist_slug, start_at);
      `;

      await sql`
        UPDATE admin_bookings
        SET
          status = 'scheduled',
          updated_at = NOW()
        WHERE status NOT IN ('scheduled', 'cancelled');
      `;
    })();
  }

  await schemaInitPromise;
}

export async function listEnquiries(limit = 100): Promise<AdminEnquiry[]> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const rows = (await sql`
    SELECT *
    FROM admin_enquiries
    ORDER BY created_at DESC
    LIMIT ${Math.max(1, Math.min(limit, 500))};
  `) as EnquiryRow[];

  return rows.map(mapEnquiry);
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<AdminEnquiry> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const [row] = (await sql`
    INSERT INTO admin_enquiries (
      first_name,
      last_name,
      email,
      phone,
      instagram,
      pronouns,
      date_of_birth,
      preferred_date,
      availability_window,
      budget_range,
      preferred_artist,
      is_cover_up,
      style_direction,
      size_and_placement,
      reference_links,
      medical_notes,
      concept,
      status,
      assigned_artist_slug,
      admin_notes
    ) VALUES (
      ${input.firstName.trim()},
      ${input.lastName.trim()},
      ${input.email?.trim() || null},
      ${input.phone?.trim() || null},
      ${input.instagram?.trim() || null},
      ${input.pronouns?.trim() || null},
      ${input.dateOfBirth?.trim() || null},
      ${input.preferredDate?.trim() || null},
      ${input.availabilityWindow?.trim() || null},
      ${input.budgetRange?.trim() || null},
      ${input.preferredArtist?.trim() || null},
      ${input.isCoverUp},
      ${input.styleDirection.trim()},
      ${input.sizeAndPlacement.trim()},
      ${input.referenceLinks?.trim() || null},
      ${input.medicalNotes?.trim() || null},
      ${input.concept.trim()},
      ${"new"},
      ${null},
      ${null}
    )
    RETURNING *;
  `) as EnquiryRow[];

  if (!row) {
    throw new Error("Could not create enquiry");
  }

  return mapEnquiry(row);
}

export async function updateEnquiry(id: number, input: UpdateEnquiryInput): Promise<AdminEnquiry> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const status = ensureEnquiryStatus(input.status);
  const assignedArtistSlug = input.assignedArtistSlug
    ? ensureArtistSlug(input.assignedArtistSlug)
    : null;

  const [row] = (await sql`
    UPDATE admin_enquiries
    SET
      status = ${status},
      assigned_artist_slug = ${assignedArtistSlug},
      admin_notes = ${input.adminNotes.trim() || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `) as EnquiryRow[];

  if (!row) {
    throw new Error("Enquiry not found");
  }

  return mapEnquiry(row);
}

export async function listBookings(
  options: {
    artistSlug?: ArtistSlug;
    startAt?: string;
    endAt?: string;
    limit?: number;
  } = {}
): Promise<AdminBooking[]> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const limit = Math.max(1, Math.min(options.limit ?? 300, 1000));
  const artistSlug = options.artistSlug ? ensureArtistSlug(options.artistSlug) : null;
  const startAt = options.startAt ? new Date(options.startAt).toISOString() : null;
  const endAt = options.endAt ? new Date(options.endAt).toISOString() : null;

  const rows = (await sql`
    SELECT *
    FROM admin_bookings
    WHERE (${artistSlug}::text IS NULL OR artist_slug = ${artistSlug})
      AND (${startAt}::timestamptz IS NULL OR end_at >= ${startAt})
      AND (${endAt}::timestamptz IS NULL OR start_at <= ${endAt})
    ORDER BY start_at ASC
    LIMIT ${limit};
  `) as BookingRow[];

  return rows.map(mapBooking);
}

export async function listWeeklyAvailability(
  artistSlug?: ArtistSlug
): Promise<WeeklyAvailabilityRule[]> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const filterSlug = artistSlug ? ensureArtistSlug(artistSlug) : null;

  const rows = (await sql`
    SELECT id, artist_slug, weekday, start_time, end_time, enabled, updated_at
    FROM admin_artist_weekly_availability
    WHERE (${filterSlug}::text IS NULL OR artist_slug = ${filterSlug})
    ORDER BY artist_slug ASC, weekday ASC;
  `) as WeeklyRuleRow[];

  return rows.map(mapWeeklyRule);
}

export async function upsertWeeklyRule(
  input: UpsertWeeklyRuleInput
): Promise<WeeklyAvailabilityRule> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const artistSlug = ensureArtistSlug(input.artistSlug);
  const weekday = ensureWeekday(input.weekday);
  const startTime = ensureClockTime(input.startTime);
  const endTime = ensureClockTime(input.endTime);

  if (input.enabled && startTime >= endTime) {
    throw new Error("End time must be after start time");
  }

  const [row] = (await sql`
    INSERT INTO admin_artist_weekly_availability (
      artist_slug,
      weekday,
      start_time,
      end_time,
      enabled,
      updated_at
    ) VALUES (
      ${artistSlug},
      ${weekday},
      ${startTime},
      ${endTime},
      ${input.enabled},
      NOW()
    )
    ON CONFLICT (artist_slug, weekday) DO UPDATE
    SET
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      enabled = EXCLUDED.enabled,
      updated_at = NOW()
    RETURNING id, artist_slug, weekday, start_time, end_time, enabled, updated_at;
  `) as WeeklyRuleRow[];

  if (!row) {
    throw new Error("Could not save weekly availability rule");
  }

  return mapWeeklyRule(row);
}

export async function listTimeOff(
  options: {
    artistSlug?: ArtistSlug;
    startAt?: string;
    endAt?: string;
    limit?: number;
  } = {}
): Promise<TimeOffPeriod[]> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const limit = Math.max(1, Math.min(options.limit ?? 200, 1000));
  const artistSlug = options.artistSlug ? ensureArtistSlug(options.artistSlug) : null;
  const startAt = options.startAt ? new Date(options.startAt).toISOString() : null;
  const endAt = options.endAt ? new Date(options.endAt).toISOString() : null;

  const rows = (await sql`
    SELECT id, created_at, artist_slug, start_at, end_at, reason
    FROM admin_artist_time_off
    WHERE (${artistSlug}::text IS NULL OR artist_slug = ${artistSlug})
      AND (${startAt}::timestamptz IS NULL OR end_at >= ${startAt})
      AND (${endAt}::timestamptz IS NULL OR start_at <= ${endAt})
    ORDER BY start_at ASC
    LIMIT ${limit};
  `) as TimeOffRow[];

  return rows.map(mapTimeOff);
}

export async function createTimeOff(input: CreateTimeOffInput): Promise<TimeOffPeriod> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const artistSlug = ensureArtistSlug(input.artistSlug);
  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new Error("Time-off start/end is invalid");
  }

  if (endAt <= startAt) {
    throw new Error("Time-off end must be after start");
  }

  const [row] = (await sql`
    INSERT INTO admin_artist_time_off (
      artist_slug,
      start_at,
      end_at,
      reason
    ) VALUES (
      ${artistSlug},
      ${startAt.toISOString()},
      ${endAt.toISOString()},
      ${input.reason?.trim() || null}
    )
    RETURNING id, created_at, artist_slug, start_at, end_at, reason;
  `) as TimeOffRow[];

  if (!row) {
    throw new Error("Could not create time-off period");
  }

  return mapTimeOff(row);
}

export async function deleteTimeOff(id: number): Promise<void> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const [row] = (await sql`
    DELETE FROM admin_artist_time_off
    WHERE id = ${id}
    RETURNING id;
  `) as Array<{ id: number }>;

  if (!row) {
    throw new Error("Time-off period not found");
  }
}

function buildWindowFromRule(
  rule: WeeklyAvailabilityRule,
  date: Date
): { startAt: Date; endAt: Date } | null {
  const [startHour, startMin] = rule.startTime.split(":").map((part) => Number.parseInt(part, 10));
  const [endHour, endMin] = rule.endTime.split(":").map((part) => Number.parseInt(part, 10));

  const start = new Date(date);
  start.setHours(startHour, startMin, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, endMin, 0, 0);

  if (end <= start) {
    return null;
  }

  return { startAt: start, endAt: end };
}

export async function listAvailabilityWindows(
  options: {
    artistSlug?: ArtistSlug;
    fromDate?: string;
    days?: number;
  } = {}
): Promise<AvailabilityWindow[]> {
  const days = Math.max(1, Math.min(options.days ?? 60, 180));
  const fromDate = options.fromDate ? new Date(options.fromDate) : new Date();
  if (Number.isNaN(fromDate.getTime())) {
    throw new Error("fromDate is invalid");
  }
  fromDate.setHours(0, 0, 0, 0);

  const toDate = new Date(fromDate);
  toDate.setDate(toDate.getDate() + days);

  const [rules, timeOff, bookings] = await Promise.all([
    listWeeklyAvailability(options.artistSlug),
    listTimeOff({
      artistSlug: options.artistSlug,
      startAt: fromDate.toISOString(),
      endAt: toDate.toISOString(),
      limit: 500,
    }),
    listBookings({
      artistSlug: options.artistSlug,
      startAt: fromDate.toISOString(),
      endAt: toDate.toISOString(),
      limit: 1000,
    }),
  ]);

  const rulesByArtist = new Map<ArtistSlug, Map<WeekdayIndex, WeeklyAvailabilityRule>>();
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const byDay = rulesByArtist.get(rule.artistSlug) ?? new Map();
    byDay.set(rule.weekday, rule);
    rulesByArtist.set(rule.artistSlug, byDay);
  }

  const scheduledByArtist = new Map<ArtistSlug, AdminBooking[]>();
  for (const booking of bookings) {
    if (booking.status !== "scheduled") continue;
    const list = scheduledByArtist.get(booking.artistSlug) ?? [];
    list.push(booking);
    scheduledByArtist.set(booking.artistSlug, list);
  }

  const timeOffByArtist = new Map<ArtistSlug, TimeOffPeriod[]>();
  for (const period of timeOff) {
    const list = timeOffByArtist.get(period.artistSlug) ?? [];
    list.push(period);
    timeOffByArtist.set(period.artistSlug, list);
  }

  const now = Date.now();
  const windows: AvailabilityWindow[] = [];

  const artistSlugsToConsider = options.artistSlug
    ? [ensureArtistSlug(options.artistSlug)]
    : Array.from(rulesByArtist.keys());

  for (const artistSlug of artistSlugsToConsider) {
    const ruleMap = rulesByArtist.get(artistSlug);
    if (!ruleMap || ruleMap.size === 0) continue;

    const artistTimeOff = timeOffByArtist.get(artistSlug) ?? [];
    const artistBookings = scheduledByArtist.get(artistSlug) ?? [];

    for (let dayOffset = 0; dayOffset < days; dayOffset++) {
      const date = new Date(fromDate);
      date.setDate(date.getDate() + dayOffset);
      const weekday = date.getDay() as WeekdayIndex;
      const rule = ruleMap.get(weekday);
      if (!rule) continue;

      const window = buildWindowFromRule(rule, date);
      if (!window) continue;
      if (window.endAt.getTime() <= now) continue;

      const windowRange = {
        startAt: window.startAt.toISOString(),
        endAt: window.endAt.toISOString(),
      };

      const isBlocked = artistTimeOff.some((period) =>
        rangesOverlap(windowRange, { startAt: period.startAt, endAt: period.endAt })
      );
      if (isBlocked) continue;

      const isBooked = artistBookings.some((booking) =>
        rangesOverlap(windowRange, { startAt: booking.startAt, endAt: booking.endAt })
      );

      windows.push({
        id: `${artistSlug}-${windowRange.startAt}`,
        artistSlug,
        startAt: windowRange.startAt,
        endAt: windowRange.endAt,
        availabilityStatus: isBooked ? "booked" : "free",
        weekday,
      });
    }
  }

  windows.sort((a, b) => a.startAt.localeCompare(b.startAt));
  return windows;
}

export async function createBooking(input: CreateBookingInput): Promise<AdminBooking> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const artistSlug = ensureArtistSlug(input.artistSlug);
  const status = ensureBookingStatus(input.status || "scheduled");

  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new Error("Booking start/end time is invalid");
  }

  if (endAt <= startAt) {
    throw new Error("Booking end time must be after start time");
  }

  if (status === "scheduled") {
    const [conflict] = (await sql`
      SELECT id
      FROM admin_bookings
      WHERE artist_slug = ${artistSlug}
        AND status = 'scheduled'
        AND tstzrange(start_at, end_at, '[)') && tstzrange(${startAt.toISOString()}::timestamptz, ${endAt.toISOString()}::timestamptz, '[)')
      LIMIT 1;
    `) as Array<{ id: number }>;

    if (conflict) {
      throw new Error("This artist already has a scheduled booking that overlaps this time window.");
    }
  }

  const enquiryId = input.enquiryId ?? null;

  const [row] = (await sql`
    WITH target_enquiry AS (
      SELECT id
      FROM admin_enquiries
      WHERE id = ${enquiryId}
    ),
    inserted AS (
      INSERT INTO admin_bookings (
        enquiry_id,
        artist_slug,
        client_name,
        client_email,
        start_at,
        end_at,
        status,
        notes
      )
      SELECT
        ${enquiryId},
        ${artistSlug},
        ${input.clientName.trim()},
        ${input.clientEmail.trim()},
        ${startAt.toISOString()},
        ${endAt.toISOString()},
        ${status},
        ${input.notes?.trim() || null}
      WHERE ${enquiryId}::integer IS NULL OR EXISTS (SELECT 1 FROM target_enquiry)
      RETURNING *
    ),
    updated AS (
      UPDATE admin_enquiries
      SET
        status = 'booked',
        assigned_artist_slug = ${artistSlug},
        updated_at = NOW()
      WHERE id IN (SELECT id FROM target_enquiry)
        AND EXISTS (SELECT 1 FROM inserted)
      RETURNING id
    )
    SELECT inserted.*
    FROM inserted;
  `) as BookingRow[];

  if (!row) {
    if (enquiryId) {
      throw new Error("Enquiry not found");
    }

    throw new Error("Could not create booking");
  }

  return mapBooking(row);
}

export async function updateBooking(id: number, input: UpdateBookingInput): Promise<AdminBooking> {
  await ensureAdminSchema();
  const sql = getSqlClient();

  const [existing] = (await sql`
    SELECT *
    FROM admin_bookings
    WHERE id = ${id}
    LIMIT 1;
  `) as BookingRow[];

  if (!existing) {
    throw new Error("Booking not found");
  }

  const status = input.status
    ? ensureBookingStatus(input.status)
    : normalizeBookingStatus(existing.status);

  const startAt = input.startAt ? new Date(input.startAt) : new Date(existing.start_at);
  const endAt = input.endAt ? new Date(input.endAt) : new Date(existing.end_at);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new Error("Booking start/end time is invalid");
  }

  if (endAt <= startAt) {
    throw new Error("Booking end time must be after start time");
  }

  if (status === "scheduled") {
    const [conflict] = (await sql`
      SELECT id
      FROM admin_bookings
      WHERE artist_slug = ${existing.artist_slug}
        AND status = 'scheduled'
        AND id <> ${id}
        AND tstzrange(start_at, end_at, '[)') && tstzrange(${startAt.toISOString()}::timestamptz, ${endAt.toISOString()}::timestamptz, '[)')
      LIMIT 1;
    `) as Array<{ id: number }>;

    if (conflict) {
      throw new Error("This artist already has a scheduled booking that overlaps this time window.");
    }
  }

  const notes = input.notes !== undefined ? input.notes.trim() : normalizeText(existing.notes);

  const [row] = (await sql`
    UPDATE admin_bookings
    SET
      start_at = ${startAt.toISOString()},
      end_at = ${endAt.toISOString()},
      status = ${status},
      notes = ${notes || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `) as BookingRow[];

  if (!row) {
    throw new Error("Booking not found");
  }

  return mapBooking(row);
}

export async function dashboardData(): Promise<{
  enquiries: AdminEnquiry[];
  bookings: AdminBooking[];
  weeklyAvailability: WeeklyAvailabilityRule[];
  timeOff: TimeOffPeriod[];
}> {
  const [enquiries, bookings, weeklyAvailability, timeOff] = await Promise.all([
    listEnquiries(120),
    listBookings({ limit: 400 }),
    listWeeklyAvailability(),
    listTimeOff({ limit: 200 }),
  ]);

  return { enquiries, bookings, weeklyAvailability, timeOff };
}
