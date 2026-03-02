import { useEffect, useMemo, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";
import { toggleAuthPopup, toggleLoginModal, setAuthPopup, setLoginModal } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = Boolean(authUser);
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setPreview(authUser.avatar?.url || null);
    }
  }, [authUser]);

  const avatarFallback = useMemo(() => {
    if (preview) return preview;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || authUser?.name || "User"
    )}&background=4f46e5&color=fff&size=128`;
  }, [preview, name, authUser]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setAuthPopup(false));
    dispatch(setLoginModal(false));
  };

  const handleProfileUpdate = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled" && res.payload) {
        setName(res.payload.name || name);
        setEmail(res.payload.email || email);
        setPreview(res.payload.avatar?.url || preview);
      }
    });
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    dispatch(updatePassword(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  // Show profile panel for both guest and authenticated
  if (!isAuthPopupOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => dispatch(setAuthPopup(false))}
      />

      {/* profile panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-background/90 backdrop-blur-xl border-l border-border shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <h2 className="text-xl font-semibold">
              {authUser?.email || "Guest"}
            </h2>
          </div>
          <button
                onClick={() => dispatch(setAuthPopup(false))}
                className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                aria-label="Close profile panel"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
            {/* Profile summary with action buttons */}
            <div className="border border-border rounded-xl p-4 flex items-center gap-4 bg-secondary/40">
              <img
                src={preview || authUser?.avatar?.url || avatarFallback}
                alt={authUser?.name || "Avatar"}
              className="w-14 h-14 rounded-full border border-border object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Profile</p>
              <p className="font-semibold truncate">{name || "Your name"}</p>
              <p className="text-sm text-muted-foreground truncate">
                {email || "email@example.com"}
              </p>
            </div>
            <button
              onClick={() => isAuthenticated && setProfileModalOpen(true)}
              disabled={!isAuthenticated}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update
            </button>
          </div>

          <button
            onClick={() => isAuthenticated && setPasswordModalOpen(true)}
            disabled={!isAuthenticated}
            className="w-full px-4 py-3 rounded-lg border border-border text-sm font-semibold hover:bg-secondary/60 text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Password
          </button>
          </div>
          {/* Session info fixed bottom */}
          <div className="p-6 border-t border-border bg-background sticky bottom-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Session</p>
                <p className="font-semibold">
                  {authUser?.name || authUser?.email || "Guest"}
                </p>
              </div>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button
                onClick={() => {
                  dispatch(setLoginModal(true));
                }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10"
                >
                  <User className="w-4 h-4" />
                  Login / Sign up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {isProfileModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

            <div className="flex items-center gap-4 mb-4">
              <label className="relative w-16 h-16 cursor-pointer">
                <img
                  src={preview || authUser?.avatar?.url || avatarFallback}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAvatar(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
                <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full text-[10px] flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Edit
                </span>
              </label>
              <div className="text-sm text-muted-foreground">
                Change your photo, name, or email.
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
              </div>
              <button
                onClick={() => {
                  handleProfileUpdate();
                  if (!isUpdatingProfile) setProfileModalOpen(false);
                }}
                disabled={isUpdatingProfile}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 font-semibold shadow-md hover:opacity-90 disabled:opacity-60"
              >
                {isUpdatingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>

            <div className="space-y-3">
              {[
                {
                  label: "Current password",
                  value: currentPassword,
                  setter: setCurrentPassword,
                  key: "current",
                },
                {
                  label: "New password",
                  value: newPassword,
                  setter: setNewPassword,
                  key: "next",
                },
                {
                  label: "Confirm new password",
                  value: confirmPassword,
                  setter: setConfirmPassword,
                  key: "confirm",
                },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{field.label}</p>
                  <div className="relative">
                    <input
                      type={showPasswords[field.key] ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full rounded-lg border border-border bg-transparent px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          [field.key]: !prev[field.key],
                        }))
                      }
                    >
                      {showPasswords[field.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  handleUpdatePassword();
                  if (!isUpdatingPassword) setPasswordModalOpen(false);
                }}
                disabled={isUpdatingPassword || !isAuthenticated}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 font-semibold border border-border hover:bg-foreground/90 disabled:opacity-60"
              >
                {isUpdatingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePanel;
