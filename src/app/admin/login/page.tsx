"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage products, prices, and orders for Nasji Culture.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
        />

        {error && (
          <p className="rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
