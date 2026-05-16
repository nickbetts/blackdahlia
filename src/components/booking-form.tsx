"use client";

import { FormEvent, useMemo, useState } from "react";
import { bookingArtists, studioInfo } from "@/content/studio";

type BookingState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pronouns: string;
  dateOfBirth: string;
  preferredDate: string;
  availabilityWindow: string;
  budgetRange: string;
  preferredArtist: string;
  isCoverUp: "No" | "Yes";
  styleDirection: string;
  sizeAndPlacement: string;
  referenceLinks: string;
  medicalNotes: string;
  concept: string;
};

const initialState: BookingState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  pronouns: "",
  dateOfBirth: "",
  preferredDate: "",
  availabilityWindow: "",
  budgetRange: "",
  preferredArtist: "",
  isCoverUp: "No",
  styleDirection: "",
  sizeAndPlacement: "",
  referenceLinks: "",
  medicalNotes: "",
  concept: "",
};

const steps = ["Contact", "Tattoo Direction", "Session Logistics", "Review & Send"] as const;

export function BookingForm() {
  const [form, setForm] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isReadyToSend = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.styleDirection.trim().length > 0 &&
      form.sizeAndPlacement.trim().length > 0 &&
      form.concept.trim().length > 0
    );
  }, [form]);

  const isCurrentStepValid = useMemo(() => {
    if (currentStep === 0) {
      return (
        form.firstName.trim().length > 0 &&
        form.lastName.trim().length > 0 &&
        form.email.trim().length > 0
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReadyToSend || currentStep !== steps.length - 1) {
      return;
    }

    const lines = [
      "Tattoo consultation brief",
      "",
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Pronouns: ${form.pronouns || "Not provided"}`,
      `Date of birth: ${form.dateOfBirth || "Not provided"}`,
      `Preferred artist: ${form.preferredArtist || "No preference"}`,
      `Style direction: ${form.styleDirection}`,
      `Cover-up: ${form.isCoverUp}`,
      `Size and placement: ${form.sizeAndPlacement || "Not provided"}`,
      `Reference links: ${form.referenceLinks || "Not provided"}`,
      `Preferred date: ${form.preferredDate || "Flexible"}`,
      `Availability window: ${form.availabilityWindow || "Flexible"}`,
      `Budget range: ${form.budgetRange || "Not provided"}`,
      `Medical notes: ${form.medicalNotes || "None provided"}`,
      "",
      "Tattoo concept:",
      form.concept,
      "",
      "Submitted from The Black Dahlia guided booking flow.",
    ];

    const subject = `Consultation request - ${form.preferredArtist || "The Black Dahlia"}`;
    const mailto = `mailto:${studioInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join("\n")
    )}`;

    window.location.href = mailto;
    setSubmitted(true);
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

          <div className="bookingGrid twoCols">
            <label>
              Email*
              <input
                required
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

          <div className="bookingGrid twoCols">
            <label>
              Budget range
              <input
                value={form.budgetRange}
                onChange={(event) => updateField("budgetRange", event.target.value)}
                placeholder="e.g. GBP300-GBP450"
              />
            </label>

            <label>
              Medical or access notes
              <input
                value={form.medicalNotes}
                onChange={(event) => updateField("medicalNotes", event.target.value)}
                placeholder="Allergies, skin sensitivities, accessibility considerations"
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
          <button type="submit" className="primaryButton" disabled={!isReadyToSend}>
            Open Consultation Email
          </button>
        )}
      </div>

      <p className="bookingHint">
        This remains a static mailto flow for reliable deployment. Your email app opens with the
        full consultation brief prefilled.
      </p>

      {submitted ? (
        <p className="bookingSuccess">Email draft opened. If nothing happened, please email us manually.</p>
      ) : null}
    </form>
  );
}
