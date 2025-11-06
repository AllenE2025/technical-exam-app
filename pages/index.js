// /pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("✅ Check your email to confirm your account!");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/secret-page-1");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    alert("⚠️ Account deletion must be handled server-side.");
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔐 Secret Page App</h1>

          {!user ? (
            <>
              <h2 style={styles.subtitle}>Login or Register</h2>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <div style={styles.buttonGroup}>
                <button onClick={handleLogin} style={{ ...styles.button, ...styles.buttonPrimary }}>
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.subtitle}>Welcome, {user.email}</h2>

              <nav style={styles.nav}>
                <a href="/secret-page-1" style={styles.navLink}>
                  Secret Page 1
                </a>
                <a href="/secret-page-2" style={styles.navLink}>
                  Secret Page 2
                </a>
                <a href="/secret-page-3" style={styles.navLink}>
                  Secret Page 3
                </a>
              </nav>

              <div style={styles.buttonGroup}>
                <button onClick={handleLogout} style={{ ...styles.button, ...styles.buttonPrimary }}>
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{ ...styles.button, ...styles.buttonDanger }}
                >
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 450,
    animation: "fadeIn 0.5s ease-in-out",
  },
  card: {
    background: "#fff",
    padding: "40px 35px",
    borderRadius: 20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    width: "100%",
    textAlign: "center", // centers headings and text
    transition: "transform 0.2s ease, box-shadow 0.3s ease",
  },
  title: {
    marginBottom: 20,
    color: "#222",
    fontWeight: "bold",
    fontSize: 26,
  },
  subtitle: {
    marginBottom: 20,
    color: "#555",
    fontSize: 18,
  },
  input: {
    display: "block",
    width: "90%", // slightly smaller than 100% to center visually
    margin: "0 auto 12px", // centers the input horizontally
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    textAlign: "center", // centers text inside
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    color: "#fff",
    transition: "opacity 0.2s, transform 0.1s",
  },
  buttonPrimary: {
    backgroundColor: "#2575fc",
  },
  buttonSecondary: {
    backgroundColor: "#6a11cb",
  },
  buttonDanger: {
    backgroundColor: "#ff4b5c",
  },
  nav: {
    margin: "20px 0",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  navLink: {
    textDecoration: "none",
    color: "#2575fc",
    fontWeight: "bold",
    transition: "color 0.2s",
  },
};

// CSS keyframes
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
