import { supabase } from './supabase'
import { User, AuthRequest, AuthResponse, validateAuth } from '../../utils/src'

export class AuthAPI {
  private static instance: AuthAPI | null = null

  static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI()
    }
    return AuthAPI.instance
  }
  async login(request: AuthRequest): Promise<AuthResponse> {
    const validation = validateAuth(request)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: request.email,
        password: request.password,
      })
      
      if (error) throw error
      
      if (!data.user) {
        throw new Error('Login failed - no user data returned')
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!,
        createdAt: data.user.created_at
      }

      return {
        user,
        token: data.session?.access_token || ''
      }
    } catch (error) {
      console.error('Supabase login error:', error)
      throw new Error(error instanceof Error ? error.message : 'Login failed')
    }
  }

  async register(request: AuthRequest & { name: string }): Promise<AuthResponse> {
    const validation = validateAuth(request)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    if (!request.name?.trim()) {
      throw new Error('Name is required')
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: request.email,
        password: request.password,
        options: {
          data: {
            name: request.name.trim()
          }
        }
      })
      
      if (error) throw error

      if (!data.user) {
        throw new Error('Registration failed - no user data returned')
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: request.name.trim(),
        createdAt: data.user.created_at
      }

      return {
        user,
        token: data.session?.access_token || ''
      }
    } catch (error) {
      console.error('Supabase registration error:', error)
      throw new Error(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  async getCurrentUser(): Promise<User | null> {

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting current user:', error)
        return null
      }

      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email!,
        createdAt: user.created_at
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async logout(): Promise<void> {

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async isAuthenticated(): Promise<boolean> {

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking authentication:', error)
        return false
      }

      return !!session?.user
    } catch (error) {
      console.error('Error checking authentication:', error)
      return false
    }
  }

  // Listen to auth state changes (useful for real-time auth updates)
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
          createdAt: session.user.created_at
        }
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}
