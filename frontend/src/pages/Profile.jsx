import { useEffect, useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import api from "../api/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users/me");

      setProfile(res.data);

      setFullName(res.data.full_name || "");
      setUsername(res.data.username || "");
      setEmail(res.data.email || "");
      setDateOfBirth(res.data.date_of_birth || "");
      setPhone(res.data.phone || "");
      setBio(res.data.bio || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    const response = await api.patch("/users/me", {
      full_name: fullName,
      username,
      email,
      date_of_birth: dateOfBirth || null,
      phone: phone || null,
      bio: bio || null,
    });

    setProfile(response.data);

    setFullName(response.data.full_name || "");
    setUsername(response.data.username || "");
    setEmail(response.data.email || "");
    setDateOfBirth(response.data.date_of_birth || "");
    setPhone(response.data.phone || "");
    setBio(response.data.bio || "");

    alert("Profile updated successfully.");
  } catch (err) {
    console.error("Failed to update profile:", err);

    const message =
      err.response?.data?.detail ||
      "Failed to update profile.";

    alert(message);
  }
};

  return (
    <Layout>

      <section className="profile-page">

        {/* Header */}
        <div className="profile-page-header">

          <button
            type="button"
            className="profile-back-btn"
            onClick={() => navigate("/settings")}
          >
            <ArrowLeft size={18} />
            Back to Settings
          </button>

          <div className="profile-title-section">

            <div className="profile-title-icon">
              <User size={22} />
            </div>

            <div>
              <h1>Profile</h1>

              <p>
                Manage your personal information and
                account details.
              </p>
            </div>

          </div>

        </div>


        {/* Profile Card */}
        <section className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>Profile Information</h2>

              <p>
                Keep your personal information up to date.
              </p>
            </div>

          </div>


          {loading ? (

            <div className="profile-loading">
              Loading profile information...
            </div>

          ) : (

            <form
              className="profile-form"
              onSubmit={handleSave}
            >

              {/* Full Name */}
              <div className="profile-field">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                />

              </div>


              {/* Username */}
              <div className="profile-field">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                />

              </div>


              {/* Email */}
              <div className="profile-field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

              </div>


              {/* Date of Birth */}
              <div className="profile-field">

                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) =>
                    setDateOfBirth(e.target.value)
                  }
                />

              </div>


              {/* Phone */}
              <div className="profile-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter your phone number"
                />

              </div>


              {/* Bio */}
              <div className="profile-field profile-field-full">

                <label htmlFor="bio">
                  Bio
                </label>

                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                  placeholder="Tell us a little about yourself..."
                  rows="4"
                />

              </div>


              {/* Actions */}
              <div className="profile-form-actions">

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => navigate("/settings")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          )}

        </section>


        {/* Account Information */}
        {!loading && profile && (
          <section className="profile-card">

            <div className="profile-card-header">

              <div>
                <h2>Account Information</h2>

                <p>
                  Basic information about your Form Craft
                  account.
                </p>
              </div>

            </div>


            <div className="profile-account-grid">

              <div className="profile-account-item">

                <span>Account Status</span>

                <strong>Active</strong>

              </div>


              <div className="profile-account-item">

                <span>Account Email</span>

                <strong>
                  {profile.email}
                </strong>

              </div>

            </div>

          </section>
        )}

      </section>

    </Layout>
  );
}

export default Profile;