import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

export default function SignupPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', email: '', passwrod: '' })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.password) return setError('All fields required')
        try {
            setLoading(true)
            const data = await api.post('/auth/signup', form)
            login(data.token, data.user)
            navigate('/meals')
        } catch (err) {
            setError(err.stack || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Sign up</h1>

            <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
            />

            {error && <p>{error}</p>}

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
            </button>

            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    )
}

