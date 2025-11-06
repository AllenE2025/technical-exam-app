// /pages/index.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert("✅ Check your email to confirm your account!")
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push("/secret-page-1")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?")
    if (!confirmDelete) return

    alert("⚠️ Account deletion must be handled server-side.")
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
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
              <button onClick={handleLogin} style={styles.buttonPrimary}>
                Login
              </button>
              <button onClick={handleRegister} style={styles.buttonSecondary}>
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
              <button onClick={handleLogout} style={styles.buttonPrimary}>
                Logout
              </button>
              <button onClick={handleDeleteAccount} style={styles.buttonDanger}>
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    marginBottom: 20,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonPrimary: {
    flex: 1,
    padding: "10px 20px",
    marginRight: 8,
    backgroundColor: "#2575fc",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  buttonSecondary: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#6a11cb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  buttonDanger: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#ff4b5c",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginLeft: 8,
  },
  nav: {
    marginBottom: 20,
  },
  navLink: {
    margin: "0 10px",
    textDecoration: "none",
    color: "#2575fc",
    fontWeight: "bold",
  },
}
