import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'
import { ROLE_PERMISSIONS } from '../config/appConfig'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState({})

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('sbm-demo-user')
    if (demoUser) {
      const parsed = JSON.parse(demoUser)
      setUser(parsed)
      setUserRole(parsed.role)
      setPermissions(ROLE_PERMISSIONS[parsed.role] || ROLE_PERMISSIONS['technician'])
      setLoading(false)
      return
    }

    // Check active sessions
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        } else {
          setUser(null)
          setUserRole(null)
          setPermissions({})
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (error) {
        // Default to technician if no profile found
        setUserRole('technician')
        setPermissions(ROLE_PERMISSIONS['technician'])
      } else {
        setUserRole(data.role)
        setPermissions(ROLE_PERMISSIONS[data.role] || ROLE_PERMISSIONS['technician'])
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole('technician')
      setPermissions(ROLE_PERMISSIONS['technician'])
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    // Clear demo user
    localStorage.removeItem('sbm-demo-user')
    
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setUserRole(null)
      setPermissions({})
    }
    return { error }
  }

  const demoLogin = (demoUser) => {
    localStorage.setItem('sbm-demo-user', JSON.stringify(demoUser))
    setUser(demoUser)
    setUserRole(demoUser.role)
    setPermissions(ROLE_PERMISSIONS[demoUser.role] || ROLE_PERMISSIONS['technician'])
  }

  const hasPermission = (permission) => {
    return permissions[permission] || false
  }

  const value = {
    user,
    userRole,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    demoLogin,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
