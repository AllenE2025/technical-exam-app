// /pages/index.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  // ✅ Check session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // ✅ Register new user
  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) alert(error.message)
    else alert("Check your email to confirm your account!")
  }

  // ✅ Log in existing user
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
    else router.push("/secret-page-1")
  }

  // ✅ Log out
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // ⚠️ Delete account (client-safe example)
  // Note: You can’t delete accounts with anon key directly
  // You’d need a Next.js API route using the service_role key
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?")
    if (!confirmDelete) return

    const { data } = await supabase.auth.getUser()
    const userId = data.user?.id

    if (!userId) return alert("No user found")

    // Instead of actual delete (which needs service key), just sign out
    alert("Account deletion must be handled server-side (not supported with anon key).")
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>🔐 Secret Page App</h1>

      {!user ? (
        <>
          <h2>Login or Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: 8 }}
          />
          <div>
            <button onClick={handleLogin} style={{ marginRight: 8 }}>
              Login
            </button>
            <button onClick={handleRegister}>Register</button>
          </div>
        </>
      ) : (
        <>
          <h2>Welcome, {user.email}</h2>
          <nav style={{ marginBottom: 16 }}>
            <a href="/secret-page-1" style={{ marginRight: 10 }}>
              Secret Page 1
            </a>
            <a href="/secret-page-2" style={{ marginRight: 10 }}>
              Secret Page 2
            </a>
            <a href="/secret-page-3" style={{ marginRight: 10 }}>
              Secret Page 3
            </a>
          </nav>
          <button onClick={handleLogout} style={{ marginRight: 8 }}>
            Logout
          </button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </>
      )}
    </div>
  )
}
