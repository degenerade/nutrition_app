import { useState } from "react"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const login = (token, user) => {
        localStorage.setItem('token', token)
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}