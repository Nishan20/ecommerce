import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updatePassword } from "../store/slices/authSlice";
import { FaUser, FaLock, FaSave } from "react-icons/fa";
import { Camera } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const [editAvatar, setEditAvatar] = useState(false);

  useEffect(() => {
    if (authUser) {
      setProfileForm({
        name: authUser.name || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
        city: authUser.city || "",
        state: authUser.state || "",
        country: authUser.country || "",
        pincode: authUser.pincode || "",
      });
    }
  }, [authUser]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileForm));
  };

  const submitPassword = (e) => {
    e.preventDefault();
    dispatch(updatePassword(passwordForm));
  };

  return (
    <div className="pt-20 min-h-screen bg-ecommerce['page-bg']">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ecommerce-heading mb-4 bg-gradient-to-r from-ecommerce-primary to-gray-800 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-ecommerce-text text-lg max-w-md mx-auto">
            Manage your account details and security settings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Details Card */}
          <div className="bg-ecommerce-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-ecommerce-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ecommerce-primary to-blue-700 flex items-center justify-center shadow-lg ring-4 ring-ecommerce['page-bg']">
                  {authUser?.avatar ? (
                    <img src={authUser.avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
                  ) : (
                    <FaUser className="w-12 h-12 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditAvatar(!editAvatar)}
                  className="absolute -bottom-2 -right-2 bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ecommerce-heading">Account Details</h2>
                <p className="text-ecommerce-text">Update your personal information</p>
              </div>
            </div>

            <form onSubmit={submitProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="Enter your phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                  Address
                </label>
                <textarea
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm resize-vertical"
                  placeholder="Enter your full address"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profileForm.state}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileForm.pincode}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm"
                    placeholder="Pincode / ZIP"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex items-center gap-2 justify-center py-4 px-6 bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="w-5 h-5" />
                {isUpdatingProfile ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-ecommerce-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-ecommerce-border md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                <FaLock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ecommerce-heading">Change Password</h2>
                <p className="text-ecommerce-text">Secure your account with a new password</p>
              </div>
            </div>

            <form onSubmit={submitPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-orange-400/20 focus:border-orange-500 focus:shadow-lg transition-all shadow-sm"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ecommerce-heading mb-3">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text placeholder:text-ecommerce-placeholder focus:ring-4 ring-emerald-400/20 focus:border-emerald-500 focus:shadow-lg transition-all shadow-sm"
                  placeholder="Enter new password (min 8 chars)"
                  minLength="8"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full flex items-center gap-2 justify-center py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaLock className="w-5 h-5" />
                {isUpdatingPassword ? "Updating Password..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
