// /pages/secret-page-1.js
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SecretPage1() {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchMessage();
  }, [user]);

  const fetchMessage = async () => {
    setLoadingMessage(true);
    const { data, error } = await supabase
      .from("secret_messages")
      .select("message")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") console.error(error);
    setMessage(data?.message || "No secret message yet.");
    setLoadingMessage(false);
  };

  if (loading) return <p style={styles.loading}>Loading user...</p>;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Secret Page 1</h1>
        <p style={styles.subtitle}>
          Welcome, <strong>{user.email}</strong>!
        </p>

        {loadingMessage ? (
          <p style={styles.loading}>Fetching your secret message...</p>
        ) : (
          <div style={styles.messageCard}>
            <h3 style={styles.messageTitle}>Your Secret Message</h3>
            <p style={styles.messageText}>{message}</p>
          </div>
        )}
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
    marginBottom: 20,
    fontSize: 16,
  },
  messageCard: {
    background: "#f0f8ff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    textAlign: "left",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  messageTitle: {
    marginBottom: 10,
    color: "#2575fc",
    fontWeight: 600,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 1.5,
  },
  loading: {
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
};
