// /pages/secret-page-2.js
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import SecretMessage from "../components/SecretMessage";

export default function SecretPage2() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading user...</p>;

  return (
    <div style={{ padding: 40 }}>
      <Navbar />
      <h1>🕵️ Secret Page 2</h1>
      <p>
        Welcome, <strong>{user.email}</strong>!
      </p>
      <p>Here you can add or edit your secret message.</p>

      {/* Reusable component that handles add/edit logic */}
      <SecretMessage user={user} />
    </div>
  );
}
