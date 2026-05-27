"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(payload?.error || "Login failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="adminLoginCard" onSubmit={handleSubmit}>
      <p className="eyebrow">Admin</p>
      <h1 className="displayMix" style={{ marginTop: "0.5rem" }}>
        Studio <em>dashboard login</em>
      </h1>
      <p className="adminLoginLead">Access calendar management and incoming enquiries.</p>

      <label>
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter admin password"
          required
        />
      </label>

      <button className="primaryButton" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {error ? <p className="adminNotice adminNoticeError">{error}</p> : null}
    </form>
  );
}
