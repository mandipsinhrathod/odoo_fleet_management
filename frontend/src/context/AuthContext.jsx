import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setUser({ ...response.data, token })
                } catch (error) {
                    console.error('Failed to authenticate token', error)
                    localStorage.removeItem('token')
                }
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (email, password) => {
        const params = new URLSearchParams()
        params.append('username', email)
        params.append('password', password)

        try {
            const response = await axios.post('http://localhost:8000/auth/login/access-token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            const token = response.data.access_token
            localStorage.setItem('token', token)

            // Get user details
            const userResponse = await axios.get('http://localhost:8000/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setUser({ ...userResponse.data, token })
            return true
        } catch (error) {
            console.error('Login failed', error)
            return false
        }
    }

    const register = async (email, password, role) => {
        try {
            await axios.post('http://localhost:8000/auth/register', {
                email,
                password,
                role
            })
            return true
        } catch (error) {
            console.error('Registration failed', error)
            throw new Error(error.response?.data?.detail || "Registration failed")
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
