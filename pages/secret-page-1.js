// /pages/secret-page-1.js
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SecretPage1() {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(true);

  // ✅ Fetch the secret message on load
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

  if (loading) return <p>Loading user...</p>;

  return (
    <div style={{ padding: 40 }}>
      <Navbar />
      <h1>🔐 Secret Page 1</h1>
      <p>
        Welcome, <strong>{user.email}</strong>!
      </p>

      {loadingMessage ? (
        <p>Fetching your secret message...</p>
      ) : (
        <div
          style={{
            background: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3>Your Secret Message</h3>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
