// /components/SecretMessage.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SecretMessage({ user }) {
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchMessage();
  }, [user]);

  const fetchMessage = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("secret_messages")
      .select("message")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") console.error(error);
    setMessage(data?.message || "");
    setInputValue(data?.message || "");
    setLoading(false);
  };

  const handleSave = async () => {
    if (!inputValue.trim()) {
      alert("Secret message cannot be empty!");
      return;
    }

    const { error } = await supabase
      .from("secret_messages")
      .upsert([{ user_id: user.id, message: inputValue }], { onConflict: "user_id" });

    if (error) {
      console.error("Error saving message:", error);
      alert("Failed to save message.");
    } else {
      setMessage(inputValue);
      setEditing(false);
      alert("Secret message saved!");
    }
  };

  if (loading) return <p style={styles.loading}>Loading your secret message...</p>;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Your Secret Message</h3>

      {!editing ? (
        <>
          <p style={styles.messageText}>{message || "No secret message yet."}</p>
          <button
            onClick={() => setEditing(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            {message ? "Edit Message" : "Add Message"}
          </button>
        </>
      ) : (
        <>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={4}
            style={styles.textarea}
          />
          <div style={styles.buttonGroup}>
            <button
              onClick={handleSave}
              style={{ ...styles.button, ...styles.buttonSuccess }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Styles
const styles = {
  card: {
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    maxWidth: 550,
    margin: "20px auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  title: {
    marginBottom: 14,
    color: "#2575fc",
    fontSize: 20,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 14,
    color: "#333",
    lineHeight: 1.5,
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 15,
    resize: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  textareaFocus: {
    borderColor: "#2575fc",
    boxShadow: "0 0 0 3px rgba(37, 117, 252, 0.2)",
  },
  buttonGroup: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s, transform 0.2s, opacity 0.2s",
  },
  buttonPrimary: {
    backgroundColor: "#2575fc",
    color: "#fff",
  },
  buttonSuccess: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  buttonSecondary: {
    backgroundColor: "#999",
    color: "#fff",
  },
  loading: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
};
