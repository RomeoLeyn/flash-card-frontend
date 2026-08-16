import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Flame,
  Folder,
  Lock,
  LogOut,
  Save,
  Target,
  User as UserIcon,
} from "lucide-react";
import type { Card, Category, ReviewStats } from "@/types/flashcards";

type ProfilePageProps = {
  user: { id: string; email: string; createdAt: string } | null;
  cards: Card[];
  categories: Category[];
  reviewStats?: ReviewStats;
  onUpdateProfile: (data: { email: string }) => Promise<void>;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  onLogout: () => void;
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="panel flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ef] text-[#50a57a]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-[-.03em]">{value}</p>
        <p className="text-sm text-[#829087]">{label}</p>
      </div>
    </div>
  );
}

export function ProfilePage({
  user,
  cards,
  categories,
  reviewStats,
  onUpdateProfile,
  onChangePassword,
  onLogout,
}: ProfilePageProps) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const realCategories = categories.filter((c) => c.id !== "all");
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "—";

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailSaving(true);
    setEmailSuccess(false);
    setEmailError(null);
    try {
      await onUpdateProfile({ email });
      setEmailSuccess(true);
    } catch (cause) {
      setEmailError(
        cause instanceof Error ? cause.message : "Failed to update profile",
      );
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordSuccess(false);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await onChangePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (cause) {
      setPasswordError(
        cause instanceof Error ? cause.message : "Failed to change password",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#17211d] text-lg font-bold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-[-.03em]">
              {user?.email?.split("@")[0] ?? "Guest"}
            </h2>
            <p className="text-sm text-[#829087]">{user?.email}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#91a098]">
              <Calendar size={13} /> Member since {memberSince}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="secondary-button self-start sm:self-center"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div>
        <p className="eyebrow px-1">Your progress</p>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={19} />}
            label="Total cards"
            value={cards.length}
          />
          <StatCard
            icon={<Folder size={19} />}
            label="Collections"
            value={realCategories.length}
          />
          <StatCard
            icon={<Target size={19} />}
            label="Reviewed today"
            value={reviewStats?.reviewedToday ?? 0}
          />
          <StatCard
            icon={<Flame size={19} />}
            label="Due for review"
            value={reviewStats?.dueCount ?? 0}
          />
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <UserIcon size={18} className="text-[#50a57a]" />
          <h3 className="text-lg font-bold tracking-[-.03em]">
            Account details
          </h3>
        </div>
        <p className="mt-1 text-sm text-[#829087]">
          Update the email associated with your account.
        </p>

        <form onSubmit={handleEmailSubmit} className="mt-6 max-w-sm space-y-4">
          <label className="field-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input"
            />
          </label>

          {emailError && (
            <div className="rounded-lg border border-[#e4b8b8] bg-[#fff3f3] p-3 text-sm text-[#c7563a]">
              {emailError}
            </div>
          )}
          {emailSuccess && (
            <div className="rounded-lg border border-[#b8d8c4] bg-[#f3fff5] p-3 text-sm text-[#3a8b5c]">
              Profile updated successfully.
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={emailSaving}
          >
            {emailSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} /> Save changes
              </>
            )}
          </button>
        </form>
      </div>

      <div className="panel p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-[#50a57a]" />
          <h3 className="text-lg font-bold tracking-[-.03em]">
            Change password
          </h3>
        </div>
        <p className="mt-1 text-sm text-[#829087]">
          Choose a strong password you don't use elsewhere.
        </p>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 max-w-sm space-y-4"
        >
          <label className="field-label">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="field-input"
              autoComplete="current-password"
            />
          </label>

          <label className="field-label">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="field-input"
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </label>

          <label className="field-label">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="field-input"
              autoComplete="new-password"
            />
          </label>

          {passwordError && (
            <div className="rounded-lg border border-[#e4b8b8] bg-[#fff3f3] p-3 text-sm text-[#c7563a]">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg border border-[#b8d8c4] bg-[#f3fff5] p-3 text-sm text-[#3a8b5c]">
              Password changed successfully.
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={passwordSaving}
          >
            {passwordSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <Lock size={17} /> Update password
              </>
            )}
          </button>
        </form>
      </div>

      <div className="panel border-[#e4b8b8] bg-[#fffaf9] p-6 sm:p-8">
        <h3 className="text-lg font-bold tracking-[-.03em] text-[#c7563a]">
          Danger zone
        </h3>
        <p className="mt-1 text-sm text-[#8a5c50]">
          Logging out will end your current session on this device.
        </p>
        <button
          onClick={onLogout}
          className="mt-4 rounded-xl border border-[#e4b8b8] bg-white px-4 py-2 text-sm font-semibold text-[#c7563a] transition hover:bg-[#fff3f3]"
        >
          Log out of this device
        </button>
      </div>
    </div>
  );
}
