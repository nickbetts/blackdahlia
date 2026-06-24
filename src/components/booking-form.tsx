"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { artists, bookingArtists } from "@/content/studio";
import type { ArtistSlug } from "@/content/studio";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import type { AvailabilityWindow } from "@/lib/admin-types";

type BookingState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  pronouns: string;
  dateOfBirth: string;
  preferredDate: string;
  availabilityWindow: string;
  preferredArtist: string;
  isCoverUp: "No" | "Yes";
  styleDirection: string;
  sizeAndPlacement: string;
  referenceLinks: string;
  concept: string;
};

const initialState: BookingState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  instagram: "",
  pronouns: "",
  dateOfBirth: "",
  preferredDate: "",
  availabilityWindow: "",
  preferredArtist: "",
  isCoverUp: "No",
  styleDirection: "",
  sizeAndPlacement: "",
  referenceLinks: "",
  concept: "",
};

const steps = ["Your details", "The tattoo", "Scheduling", "Send it"] as const;

function formatSlotLabel(slot: AvailabilityWindow): string {
  const start = new Date(slot.startAt);
  const end = new Date(slot.endAt);

  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(start);

  const startTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);

  const endTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(end);

  return `${date} ${startTime} - ${endTime}`;
}

export function BookingForm() {
  const [form, setForm] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAvailabilitySlotId, setSelectedAvailabilitySlotId] = useState<string>("");
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilityWindow[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const selectedArtistSlug = useMemo<ArtistSlug | null>(() => {
    if (!form.preferredArtist) {
      return null;
    }

    const artist = artists.find((item) => item.name === form.preferredArtist);
    return artist?.slug || null;
  }, [form.preferredArtist]);

  useEffect(() => {
    setSelectedAvailabilitySlotId("");

    if (!selectedArtistSlug) {
      setAvailabilitySlots([]);
      setAvailabilityError(null);
      setIsLoadingAvailability(false);
      return;
    }

    let cancelled = false;

    async function loadAvailability() {
      setIsLoadingAvailability(true);
      setAvailabilityError(null);

      try {
        const response = await fetch(`/api/availability?artistSlug=${selectedArtistSlug}`);
        const payload = (await response.json().catch(() => null)) as
          | { slots?: AvailabilityWindow[]; error?: string }
          | null;

        if (!response.ok || !payload?.slots) {
          throw new Error(payload?.error || "Could not load available slots.");
        }

        if (!cancelled) {
          setAvailabilitySlots(payload.slots);
        }
      } catch (error) {
        if (!cancelled) {
          setAvailabilitySlots([]);
          setAvailabilityError(
            error instanceof Error ? error.message : "Could not load available slots."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAvailability(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedArtistSlug]);

  const freeAvailabilitySlots = useMemo(
    () => availabilitySlots.filter((slot) => slot.availabilityStatus === "free"),
    [availabilitySlots]
  );

  const hasContactMethod =
    form.email.trim().length > 0 ||
    form.phone.trim().length > 0 ||
    form.instagram.trim().length > 0;

  const isReadyToSend = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      hasContactMethod &&
      form.styleDirection.trim().length > 0 &&
      form.sizeAndPlacement.trim().length > 0 &&
      form.concept.trim().length > 0
    );
  }, [form, hasContactMethod]);

  const isCurrentStepValid = useMemo(() => {
    if (currentStep === 0) {
      return (
        form.firstName.trim().length > 0 &&
        form.lastName.trim().length > 0 &&
        hasContactMethod
      );
    }

    if (currentStep === 1) {
      return (
        form.styleDirection.trim().length > 0 &&
        form.sizeAndPlacement.trim().length > 0 &&
        form.concept.trim().length > 0
      );
    }

    return true;
  }, [currentStep, form]);

  function updateField<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleAvailabilitySlotSelect(slotId: string) {
    setSelectedAvailabilitySlotId(slotId);

    if (!slotId) {
      return;
    }

    const slot = availabilitySlots.find((item) => String(item.id) === slotId);

    if (!slot) {
      return;
    }

    const start = new Date(slot.startAt);
    const end = new Date(slot.endAt);

    const timeWindow = `${new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(start)} - ${new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(end)}`;

    setForm((current) => ({
      ...current,
      preferredDate: slot.startAt.slice(0, 10),
      availabilityWindow: timeWindow,
    }));
  }

  function goToNextStep() {
    if (!isCurrentStepValid || currentStep >= steps.length - 1) {
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function goToPreviousStep() {
    if (currentStep <= 0) {
      return;
    }

    setCurrentStep((step) => step - 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReadyToSend || currentStep !== steps.length - 1) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitted(false);

    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          isCoverUp: form.isCoverUp === "Yes",
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not submit your booking brief right now.");
      }

      setSubmitted(true);
      setForm(initialState);
      setCurrentStep(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit your booking brief right now.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="bookingForm" onSubmit={handleSubmit}>
      <div className="bookingStepper" aria-label="Booking steps">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            className={`bookingStepChip${index === currentStep ? " active" : ""}${index < currentStep ? " complete" : ""}`}
            onClick={() => {
              if (index <= currentStep) {
                setCurrentStep(index);
              }
            }}
            aria-current={index === currentStep ? "step" : undefined}
          >
            <span>{index + 1}</span> {step}
          </button>
        ))}
      </div>

      <p className="bookingProgressLabel">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>

      {currentStep === 0 ? (
        <div className="bookingStepBody">
          <div className="bookingGrid twoCols">
            <label>
              First name*
              <input
                required
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                autoComplete="given-name"
              />
            </label>
            <label>
              Last name*
              <input
                required
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                autoComplete="family-name"
              />
            </label>
          </div>

          <p className="bookingHint">
            We just need one way to reach you. Email, phone or Instagram all work.
          </p>

          <div className="bookingGrid twoCols">
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                autoComplete="tel"
              />
            </label>
          </div>

          <label>
            Instagram
            <input
              value={form.instagram}
              onChange={(event) => updateField("instagram", event.target.value)}
              placeholder="@yourhandle"
              autoComplete="off"
            />
          </label>

          <div className="bookingGrid twoCols">
            <label>
              Pronouns
              <input value={form.pronouns} onChange={(event) => updateField("pronouns", event.target.value)} />
            </label>
            <label>
              Date of birth
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => updateField("dateOfBirth", event.target.value)}
              />
            </label>
          </div>
        </div>
      ) : null}

      {currentStep === 1 ? (
        <div className="bookingStepBody">
          <div className="bookingGrid twoCols">
            <label>
              Preferred artist
              <select
                value={form.preferredArtist}
                onChange={(event) => updateField("preferredArtist", event.target.value)}
              >
                <option value="">No preference</option>
                {bookingArtists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Style direction*
              <input
                required
                value={form.styleDirection}
                onChange={(event) => updateField("styleDirection", event.target.value)}
                placeholder="e.g. black and grey realism, dotwork, illustrative"
              />
            </label>
          </div>

          <div className="bookingGrid twoCols">
            <label>
              Is this a cover-up?
              <select value={form.isCoverUp} onChange={(event) => updateField("isCoverUp", event.target.value as "No" | "Yes")}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>

            <label>
              Size and placement*
              <input
                required
                value={form.sizeAndPlacement}
                onChange={(event) => updateField("sizeAndPlacement", event.target.value)}
                placeholder="e.g. 12cm forearm piece"
              />
            </label>
          </div>

          <label>
            Reference links
            <input
              value={form.referenceLinks}
              onChange={(event) => updateField("referenceLinks", event.target.value)}
              placeholder="Instagram links, Pinterest board, or image URLs"
            />
          </label>

          <label>
            Describe your tattoo concept*
            <textarea
              required
              rows={7}
              value={form.concept}
              onChange={(event) => updateField("concept", event.target.value)}
              placeholder="Theme, composition, mood, placement, and any non-negotiables."
            />
          </label>
        </div>
      ) : null}

      {currentStep === 2 ? (
        <div className="bookingStepBody">
          <div className="bookingAvailabilityPanel">
            <p className="bookingAvailabilityTitle">Live artist availability</p>

            {!selectedArtistSlug ? (
              <p className="bookingAvailabilityHint">
                Choose a preferred artist in the previous step to see their available dates and times.
              </p>
            ) : isLoadingAvailability ? (
              <p className="bookingAvailabilityHint">Loading availability...</p>
            ) : availabilityError ? (
              <p className="bookingError">{availabilityError}</p>
            ) : availabilitySlots.length === 0 ? (
              <p className="bookingAvailabilityHint">
                No upcoming availability has been published yet for this artist.
              </p>
            ) : (
              <>
                <label>
                  Available date/time slots
                  <select
                    value={selectedAvailabilitySlotId}
                    onChange={(event) => handleAvailabilitySlotSelect(event.target.value)}
                  >
                    <option value="">Select a free slot</option>
                    {availabilitySlots.map((slot) => (
                      <option
                        key={slot.id}
                        value={slot.id}
                        disabled={slot.availabilityStatus === "booked"}
                      >
                        {formatSlotLabel(slot)} ({slot.availabilityStatus})
                      </option>
                    ))}
                  </select>
                </label>

                <p className="bookingAvailabilityHint">
                  {freeAvailabilitySlots.length} free slot{freeAvailabilitySlots.length === 1 ? "" : "s"} available for {form.preferredArtist}.
                </p>
              </>
            )}
          </div>

          <div className="bookingGrid twoCols">
            <label>
              Preferred date
              <input
                type="date"
                value={form.preferredDate}
                onChange={(event) => updateField("preferredDate", event.target.value)}
              />
            </label>

            <label>
              Availability window
              <input
                value={form.availabilityWindow}
                onChange={(event) => updateField("availabilityWindow", event.target.value)}
                placeholder="e.g. weekdays after 4pm"
              />
            </label>
          </div>

        </div>
      ) : null}

      {currentStep === 3 ? (
        <div className="bookingStepBody">
          <div className="bookingSummary" aria-live="polite">
            <div className="bookingSummaryRow">
              <span>Name</span>
              <strong>
                {form.firstName} {form.lastName}
              </strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Email</span>
              <strong>{form.email || "Not provided"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Phone</span>
              <strong>{form.phone || "Not provided"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Instagram</span>
              <strong>{form.instagram || "Not provided"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Artist preference</span>
              <strong>{form.preferredArtist || "No preference"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Style direction</span>
              <strong>{form.styleDirection || "Not provided"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Size and placement</span>
              <strong>{form.sizeAndPlacement || "Not provided"}</strong>
            </div>
            <div className="bookingSummaryRow">
              <span>Concept brief</span>
              <strong>{form.concept || "Not provided"}</strong>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bookingControls">
        {currentStep > 0 ? (
          <button type="button" className="ghostButton" onClick={goToPreviousStep}>
            Back
          </button>
        ) : null}

        {currentStep < steps.length - 1 ? (
          <button type="button" className="primaryButton" onClick={goToNextStep} disabled={!isCurrentStepValid}>
            Continue
          </button>
        ) : (
          <ShimmerButton
            type="submit"
            disabled={!isReadyToSend || isSubmitting}
            className="disabled:opacity-40 disabled:cursor-not-allowed w-full min-h-13 text-[1.05rem]"
          >
            {isSubmitting ? "Sending..." : "Send my brief"}
          </ShimmerButton>
        )}
      </div>

      <p className="bookingHint">
        Hit send and it lands with the studio team first, then goes to the right artist.
      </p>

      {submitted ? (
        <p className="bookingSuccess">Thanks. Your enquiry is in the studio queue and the team will follow up.</p>
      ) : null}

      {submitError ? <p className="bookingError">{submitError}</p> : null}
    </form>
  );
}
