import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { queryClient } from '../main'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                // Invalid stored user data
                localStorage.removeItem('user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = useCallback(async (email, password) => {
        const response = await authApi.login(email, password)
        const { token: newToken, username } = response

        setToken(newToken)
        setUser({ username })

        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify({ username }))

        return response
    }, [])

    const register = useCallback(async (userData) => {
        // Just register the user, don't auto-login
        // User will need to login separately after registration
        const response = await authApi.register(userData)
        return response
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Clear all cached queries to prevent data leaks between users
        queryClient.clear()
    }, [])

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
