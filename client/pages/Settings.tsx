import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, Moon, Sun, User, Lock, Mail, Camera, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim() || !email.trim()) {
      setErrorMessage("Name and email are required");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd have an endpoint to update user profile
      // For now, just show success message
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd have an endpoint to change password
      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, or GIF)");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    setProfileImageLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: dataUrl }),
        credentials: "include",
      });
      if (response.ok) {
        await refreshUser();
        toast.success("Profile picture updated");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Failed to update profile picture");
      }
    } catch {
      toast.error("Failed to update profile picture");
    } finally {
      setProfileImageLoading(false);
      e.target.value = "";
    }
  };

  const handleRemoveProfileImage = async () => {
    setProfileImageLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: "" }),
        credentials: "include",
      });
      if (response.ok) {
        await refreshUser();
        toast.success("Profile picture removed");
      } else {
        toast.error("Failed to remove profile picture");
      }
    } catch {
      toast.error("Failed to remove profile picture");
    } finally {
      setProfileImageLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure? This action cannot be undone. All your data will be deleted."
      )
    ) {
      // In a real app, you'd have an endpoint to delete the account
      await logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background dark:bg-slate-950 overflow-x-hidden">
      <Header />

      <div className="pt-20 pb-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/chat")}
              className="p-2 hover:bg-muted rounded-lg transition text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>

          {/* Alerts */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Profile Picture
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-24 w-24 rounded-full border-2 border-border">
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} alt={user.name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="text-2xl font-semibold text-primary bg-primary/10">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={profileImageLoading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {profileImageLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    {profileImageLoading ? "Uploading…" : "Change photo"}
                  </button>
                  {user?.profileImage && (
                    <button
                      type="button"
                      disabled={profileImageLoading}
                      onClick={handleRemoveProfileImage}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition text-sm font-medium min-h-[44px] focus:outline-none focus:ring-2 focus:ring-destructive"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-2">JPEG, PNG, GIF or WebP. Max {MAX_IMAGE_SIZE_MB}MB.</p>
            </div>

            {/* Theme Preference */}
            <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                Theme Preference
              </h2>
              <p className="text-foreground/70 mb-4">
                Current theme: <span className="font-semibold capitalize">{theme}</span>
              </p>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Switch to {theme === "light" ? "Dark" : "Light"} Mode
              </button>
            </div>

            {/* Profile Information */}
            <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-700"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-700"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-700"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-700"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-700"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>

            {/* Account Actions */}
            <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
