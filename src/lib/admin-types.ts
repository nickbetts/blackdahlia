import type { ArtistSlug } from "@/content/studio";

export const enquiryStatuses = [
  "new",
  "in_review",
  "awaiting_client",
  "booked",
  "closed",
] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const bookingStatuses = ["scheduled", "cancelled"] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export type AdminEnquiry = {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  pronouns: string;
  dateOfBirth: string;
  preferredDate: string;
  availabilityWindow: string;
  budgetRange: string;
  preferredArtist: string;
  assignedArtistSlug: ArtistSlug | null;
  isCoverUp: boolean;
  styleDirection: string;
  sizeAndPlacement: string;
  referenceLinks: string;
  medicalNotes: string;
  concept: string;
  status: EnquiryStatus;
  adminNotes: string;
};

export type AdminBooking = {
  id: number;
  createdAt: string;
  updatedAt: string;
  enquiryId: number | null;
  artistSlug: ArtistSlug;
  clientName: string;
  clientEmail: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  notes: string;
};

export const weekdayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeeklyAvailabilityRule = {
  artistSlug: ArtistSlug;
  weekday: WeekdayIndex;
  startTime: string;
  endTime: string;
  enabled: boolean;
  updatedAt: string;
};

export type TimeOffPeriod = {
  id: number;
  createdAt: string;
  artistSlug: ArtistSlug;
  startAt: string;
  endAt: string;
  reason: string;
};

export type AvailabilityStatus = "free" | "booked";

export type AvailabilityWindow = {
  id: string;
  artistSlug: ArtistSlug;
  startAt: string;
  endAt: string;
  availabilityStatus: AvailabilityStatus;
  weekday: WeekdayIndex;
};

export type CreateEnquiryInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  instagram?: string;
  pronouns?: string;
  dateOfBirth?: string;
  preferredDate?: string;
  availabilityWindow?: string;
  budgetRange?: string;
  preferredArtist?: string;
  isCoverUp: boolean;
  styleDirection: string;
  sizeAndPlacement: string;
  referenceLinks?: string;
  medicalNotes?: string;
  concept: string;
};

export type UpdateEnquiryInput = {
  status: EnquiryStatus;
  assignedArtistSlug: ArtistSlug | null;
  adminNotes: string;
};

export type CreateBookingInput = {
  enquiryId?: number | null;
  artistSlug: ArtistSlug;
  clientName: string;
  clientEmail: string;
  startAt: string;
  endAt: string;
  status?: BookingStatus;
  notes?: string;
};

export type UpdateBookingInput = {
  startAt?: string;
  endAt?: string;
  status?: BookingStatus;
  notes?: string;
};

export type UpsertWeeklyRuleInput = {
  artistSlug: ArtistSlug;
  weekday: WeekdayIndex;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export type CreateTimeOffInput = {
  artistSlug: ArtistSlug;
  startAt: string;
  endAt: string;
  reason?: string;
};

export type ArtistAdminOption = {
  slug: ArtistSlug;
  name: string;
};
