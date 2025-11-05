// /components/Navbar.js
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // ✅ Check for logged-in user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // ✅ Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // ⚠️ Delete account (requires server-side service role to actually delete)
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?")
    if (!confirmDelete) return

    alert("Account deletion requires server-side permissions (not supported with anon key).")
    await supabase.auth.signOut()
    router.push("/")
  }

  // 🧠 Don’t render anything if not logged in
  if (!user) return null

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#222",
        color: "#fff",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <div>
        <strong>Secret Page App</strong>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <a href="/secret-page-1" style={{ color: "#fff", textDecoration: "none" }}>
          Secret Page 1
        </a>
        <a href="/secret-page-2" style={{ color: "#fff", textDecoration: "none" }}>
          Secret Page 2
        </a>
        <a href="/secret-page-3" style={{ color: "#fff", textDecoration: "none" }}>
          Secret Page 3
        </a>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          style={{
            background: "#d33",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </nav>
  )
}
