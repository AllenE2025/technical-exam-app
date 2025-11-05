// /components/SecretMessage.js
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function SecretMessage({ user }) {
  const [message, setMessage] = useState("")
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (!user) return
    fetchMessage()
  }, [user])

  // ✅ Fetch the current user’s secret message
  const fetchMessage = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("secret_messages")
      .select("message")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") console.error(error) // Ignore "no rows found"
    setMessage(data?.message || "")
    setInputValue(data?.message || "")
    setLoading(false)
  }

  // ✅ Save or update message
  const handleSave = async () => {
    if (!inputValue.trim()) {
      alert("Secret message cannot be empty!")
      return
    }

    const { error } = await supabase
      .from("secret_messages")
      .upsert([{ user_id: user.id, message: inputValue }], { onConflict: "user_id" })

    if (error) {
      console.error("Error saving message:", error)
      alert("Failed to save message.")
    } else {
      setMessage(inputValue)
      setEditing(false)
      alert("Secret message saved!")
    }
  }

  if (loading) return <p>Loading your secret message...</p>

  return (
    <div
      style={{
        background: "#f4f4f4",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        marginTop: "20px",
      }}
    >
      <h3>Your Secret Message</h3>

      {!editing ? (
        <>
          <p>{message || "No secret message yet."}</p>
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "#333",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
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
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleSave}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#999",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}
