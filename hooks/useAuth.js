// /hooks/useAuth.js
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function useAuth(redirectTo = "/") {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1️⃣ Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push(redirectTo)
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })

    // 2️⃣ Listen for auth changes (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push(redirectTo)
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.subscription.unsubscribe()
  }, [router, redirectTo])

  return { user, loading }
}
