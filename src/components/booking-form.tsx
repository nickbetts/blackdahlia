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
  preferredArtist: string;
  isCoverUp: "No" | "Yes";
  sizeAndPlacement: string;
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
  preferredArtist: "",
  isCoverUp: "No",
  sizeAndPlacement: "",
  concept: "",
};

export function BookingForm() {
  const [form, setForm] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.concept.trim().length > 0
    );
  }, [form]);

  function updateField<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    const lines = [
      "Tattoo booking request",
      "",
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Pronouns: ${form.pronouns || "Not provided"}`,
      `Date of birth: ${form.dateOfBirth || "Not provided"}`,
      `Preferred date: ${form.preferredDate || "Flexible"}`,
      `Preferred artist: ${form.preferredArtist || "No preference"}`,
      `Cover-up: ${form.isCoverUp}`,
      `Size and placement: ${form.sizeAndPlacement || "Not provided"}`,
      "",
      "Tattoo concept:",
      form.concept,
      "",
      "Submitted from the rebuilt static booking page.",
    ];

    const subject = `Booking request - ${form.preferredArtist || "The Black Dahlia"}`;
    const mailto = `mailto:${studioInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join("\n")
    )}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <form className="bookingForm" onSubmit={handleSubmit}>
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
          Size and placement
          <input
            value={form.sizeAndPlacement}
            onChange={(event) => updateField("sizeAndPlacement", event.target.value)}
            placeholder="e.g. 12cm forearm piece"
          />
        </label>
      </div>

      <label>
        Describe your tattoo concept*
        <textarea
          required
          rows={7}
          value={form.concept}
          onChange={(event) => updateField("concept", event.target.value)}
          placeholder="Style, references, mood, placement, and any must-have details."
        />
      </label>

      <button type="submit" className="primaryButton" disabled={!isValid}>
        Start Booking Email
      </button>

      <p className="bookingHint">
        This is a static mailto flow. Your email app opens with the completed booking brief so the studio can reply directly.
      </p>

      {submitted ? <p className="bookingSuccess">Email draft opened. If nothing happened, please email us manually.</p> : null}
    </form>
  );
}
