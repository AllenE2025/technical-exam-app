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

  // ✅ Load friends + requests
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  // ✅ Fetch current user's friends
  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from("friends")
      .select("friend_id, users:friend_id(email)")
      .eq("user_id", user.id)
      .eq("status", "accepted");

    if (error) console.error(error);
    else setFriends(data);
  };

  // ✅ Fetch pending friend requests (where current user is the target)
  const fetchFriendRequests = async () => {
    const { data, error } = await supabase
      .from("friends")
      .select("id, user_id, users:user_id(email)")
      .eq("friend_id", user.id)
      .eq("status", "pending");

    if (error) console.error(error);
    else setRequests(data);
  };

  // ✅ Send friend request
  const handleAddFriend = async () => {
    setError(null);
    if (!friendEmail) return alert("Please enter a friend's email.");

    const { data: friendUser, error: userError } = await supabase
      .from("auth.users")
      .select("id, email")
      .eq("email", friendEmail)
      .single();

    if (userError || !friendUser) {
      setError("No user found with that email.");
      return;
    }

    if (friendUser.id === user.id) {
      setError("You cannot add yourself.");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      {
        user_id: user.id,
        friend_id: friendUser.id,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setError("Failed to send friend request.");
    } else {
      alert("Friend request sent!");
      setFriendEmail("");
    }
  };

  // ✅ Accept friend request
  const handleAccept = async (requestId) => {
    const { data, error } = await supabase
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

  // ✅ View friend secret messages
  const handleViewFriendMessage = async (friendId) => {
    setError(null);
    const { data, error } = await supabase
      .from("secret_messages")
      .select("message")
      .eq("user_id", friendId)
      .single();

    if (error && error.code === "PGRST116") {
      setError("401: You are not friends with this user or message not found.");
      return;
    }

    if (error) {
      console.error(error);
      setError("Error retrieving friend’s message.");
      return;
    }

    setFriendMessages([{ friendId, message: data.message }]);
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <div style={{ padding: 40 }}>
      <Navbar />
      <h1>👥 Secret Page 3</h1>
      <p>
        Welcome, <strong>{user.email}</strong>!
      </p>
      <p>Here you can add friends and view their secret messages.</p>

      <div
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3>Add a Friend</h3>
        <input
          type="email"
          placeholder="Friend's email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddFriend}
          style={{
            background: "#333",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "4px",
            marginLeft: "8px",
            cursor: "pointer",
          }}
        >
          Send Request
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Pending Friend Requests</h3>
        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id}>
              <p>
                {req.users.email}
                <button
                  onClick={() => handleAccept(req.id)}
                  style={{
                    marginLeft: "10px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
              </p>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Your Friends</h3>
        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          friends.map((f) => (
            <div key={f.friend_id}>
              <p>
                {f.users.email}
                <button
                  onClick={() => handleViewFriendMessage(f.friend_id)}
                  style={{
                    marginLeft: "10px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View Secret
                </button>
              </p>
            </div>
          ))
        )}
      </div>

      {friendMessages.length > 0 && (
        <div
          style={{
            background: "#e9ecef",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "30px",
          }}
        >
          <h3>Friend's Secret Message</h3>
          {friendMessages.map((f) => (
            <p key={f.friendId}>{f.message}</p>
          ))}
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}
