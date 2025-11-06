// /components/Navbar.js
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check for logged-in user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    alert("Account deletion requires server-side permissions (not supported with anon key).");
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Secret Page App</div>

      <div style={styles.links}>
        <a href="/secret-page-1" style={styles.link}>Secret Page 1</a>
        <a href="/secret-page-2" style={styles.link}>Secret Page 2</a>
        <a href="/secret-page-3" style={styles.link}>Secret Page 3</a>
      </div>

      <div style={styles.actions}>
        <button onClick={handleLogout} style={{ ...styles.button, ...styles.buttonPrimary }}>Logout</button>
        <button onClick={handleDeleteAccount} style={{ ...styles.button, ...styles.buttonDanger }}>Delete</button>
      </div>
    </nav>
  );
}

// Styles
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#222",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 30,
    flexWrap: "wrap",
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  brand: {
    fontWeight: "bold",
    fontSize: 20,
  },
  links: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 8,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 8,
    transition: "background 0.2s, transform 0.2s",
  },
  linkHover: {
    background: "rgba(255,255,255,0.1)",
    transform: "scale(1.05)",
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s, transform 0.2s",
  },
  buttonPrimary: {
    backgroundColor: "#2575fc",
    color: "#fff",
  },
  buttonDanger: {
    backgroundColor: "#d33",
    color: "#fff",
  },
};
