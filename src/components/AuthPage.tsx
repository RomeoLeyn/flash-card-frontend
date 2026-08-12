import { useState } from "react";
import { authService } from "@/services/authService";

type AuthPageProps = {
  onAuthenticated: () => void;
};

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await authService.login(email.trim(), password);
      } else {
        await authService.register(email.trim(), password);
      }
      onAuthenticated();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Authentication failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#17211d]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12 sm:px-8">
        <div className="rounded-[32px] border border-[#e7eee6] bg-white p-8 shadow-lg shadow-[#d7e5df]/60">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[.2em] text-[#8d9a90]">
              Welcome back
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-[-.05em]">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>
            <p className="mt-3 text-sm text-[#727f77]">
              Use your email and password to access your flashcards.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-semibold text-[#4f5e55]">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[#dbe2dc] bg-[#f8fbf8] px-4 py-3 text-sm outline-none transition focus:border-[#64a875]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#4f5e55]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[#dbe2dc] bg-[#f8fbf8] px-4 py-3 text-sm outline-none transition focus:border-[#64a875]"
              />
            </label>

            {error && (
              <p className="rounded-2xl bg-[#ffe4e0] px-4 py-3 text-sm text-[#9b2a22]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#50a57a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#478c69] disabled:cursor-not-allowed disabled:bg-[#9fc3ab]"
            >
              {loading
                ? "Processing…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-[#68756a]">
            <span>
              {mode === "signin" ? "New here?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="font-semibold text-[#50a57a] transition hover:text-[#3f8967]"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
