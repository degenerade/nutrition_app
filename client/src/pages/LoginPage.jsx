import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.email || !form.password) return setError('All fields required')
        try {
            setLoading(true)
            const data = await api.post('/auth/login', form)
            login(data.token, data.user)
            navigate('/meals')
        } catch {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Log in</h1>

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />

            {error && <p>{error}</p>}

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </button>

            <p>No account? <Link to="/signup">Sign up</Link></p>
        </div>
    )
}