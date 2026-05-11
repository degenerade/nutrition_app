import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import styles from '../styles/SignupLoginPage.module.css'

export default function SignupPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', email: '', password: '' })
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
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Sign up</h1>
                <div className={styles.fields}>
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
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={`btn btn-primary ${styles.submitBtn}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign up'}
                </button>

                <p className={styles.link}>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
        </div>
    )
}

