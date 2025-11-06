// /pages/secret-page-3.js
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

export default function SecretPage3() {
  const { user, loading } = useAuth();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [friendMessages, setFriendMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from("friends")
      .select(`
        user_id,
        friend_id,
        user: user_id (email),
        friend: friend_id (email)
      `)
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (error) console.error(error);
    else setFriends(data || []);
  };

  const fetchFriendRequests = async () => {
    const { data, error } = await supabase
      .from("friends")
      .select(`
        id,
        user_id,
        user: user_id (email)
      `)
      .eq("friend_id", user.id)
      .eq("status", "pending");

    if (error) console.error(error);
    else setRequests(data || []);
  };

  const handleAddFriend = async () => {
    setError(null);
    if (!friendEmail) return alert("Please enter a friend's email.");

    const { data: friend, error } = await supabase
      .from("app_users")
      .select("id, email")
      .eq("email", friendEmail)
      .single();

    if (error || !friend) {
      alert("No user with that email found.");
      return;
    }

    if (friend.id === user.id) {
      alert("You cannot add yourself as a friend.");
      return;
    }

    const { data: exists } = await supabase
      .from("friends")
      .select("*")
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`
      )
      .single();

    if (exists) {
      alert("Friend request or friendship already exists.");
      return;
    }

    const { error: insertError } = await supabase
      .from("friends")
      .insert({ user_id: user.id, friend_id: friend.id, status: "pending" });

    if (insertError) console.error(insertError);
    else alert("Friend request sent!");
  };

  const handleAccept = async (requestId) => {
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) console.error(error);
    else {
      alert("Friend request accepted!");
      fetchFriends();
      fetchFriendRequests();
    }
  };

  const handleViewFriendMessage = async (friendId) => {
    setError(null);
    const { data, error } = await supabase
      .from("secret_messages")
      .select("message")
      .eq("user_id", friendId)
      .single();

    if (error && error.code === "PGRST116") {
      setError("You are not friends with this user or message not found.");
      return;
    }

    if (error) {
      console.error(error);
      setError("Error retrieving friend's message.");
      return;
    }

    setFriendMessages([{ friendId, message: data?.message || "No message yet." }]);
  };

  if (loading) return <p>Loading user...</p>;

  const cardStyle = {
    background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    marginTop: 20,
    maxWidth: 500,
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const buttonStyle = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
  };

  const buttonHover = {
    transform: "scale(1.05)",
  };

  return (
    <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <h1 style={{ marginBottom: 20, color: "#333" }}>👥 Secret Page 3</h1>
      <p style={{ marginBottom: 20, color: "#555" }}>
        Welcome, <strong>{user.email}</strong>! Manage your friends and view their secret messages.
      </p>

      {/* Add friend */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 12 }}>Add a Friend</h3>
        <input
          type="email"
          placeholder="Friend's email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "70%" }}
        />
        <button
          onClick={handleAddFriend}
          style={{ ...buttonStyle, marginLeft: 10, background: "#007bff", color: "#fff" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Send Request
        </button>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>

      {/* Pending requests */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 12 }}>Pending Friend Requests</h3>
        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span>{req.user.email}</span>
              <button
                onClick={() => handleAccept(req.id)}
                style={{ ...buttonStyle, background: "#28a745", color: "#fff" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Accept
              </button>
            </div>
          ))
        )}
      </div>

      {/* Friends list */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 12 }}>Your Friends</h3>
        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          friends.map((f) => {
            const otherEmail = f.user_id === user.id ? f.friend.email : f.user.email;
            const otherId = f.user_id === user.id ? f.friend_id : f.user_id;
            return (
              <div
                key={otherId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span>{otherEmail}</span>
                <button
                  onClick={() => handleViewFriendMessage(otherId)}
                  style={{ ...buttonStyle, background: "#ff6f61", color: "#fff" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  View Secret
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Friend messages */}
      {friendMessages.length > 0 && (
        <div style={{ ...cardStyle, background: "#f0f8ff" }}>
          <h3 style={{ marginBottom: 12 }}>Friend's Secret Message</h3>
          {friendMessages.map((f) => (
            <p key={f.friendId}>{f.message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
