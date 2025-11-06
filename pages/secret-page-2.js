// /pages/secret-page-2.js
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import SecretMessage from "../components/SecretMessage";

export default function SecretPage2() {
  const { user, loading } = useAuth();

  if (loading) return <p style={styles.loading}>Loading user...</p>;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.card}>
        <h1 style={styles.title}>🕵️ Secret Page 2</h1>
        <p style={styles.subtitle}>
          Welcome, <strong>{user.email}</strong>!
        </p>
        <p style={styles.infoText}>Here you can add or edit your secret message.</p>

        {/* Reusable component that handles add/edit logic */}
        <SecretMessage user={user} />
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "Inter, sans-serif",
    paddingBottom: 40,
  },
  card: {
    maxWidth: 600,
    margin: "40px auto 0",
    background: "#fff",
    borderRadius: 16,
    padding: 30,
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  title: {
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    color: "#555",
    marginBottom: 12,
    fontSize: 16,
  },
  infoText: {
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  loading: {
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
};
