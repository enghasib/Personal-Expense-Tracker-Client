import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          User Profile
        </h1>
        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}
        {profile && (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Username</p>
              <p className="text-gray-600">{profile.profile.username}</p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600">{profile.profile.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleGoBack}
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
