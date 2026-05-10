import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Navbar() {
    const { token, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '12px 24px',
            borderBottom:   '0.05px solid var(--border)',
            background:     'var(--bg-base)',
            position:       'sticky',
            top:            0,
            zIndex:         10,
        }}>

            {/* logo */}
            <Link to='/meals' style={{
                textDecoration: 'none',
                display:    'flex',
                alignItems: 'center',
                gap:        '8px',
                fontSize:   '17px',
                fontWeight: '500',
                color:      'var(--accent)'
            }}>
                🥬 nourish
            </Link>

            {/* links - show only when logged in */}
            {token && (
                <div style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '8px'
                }}>
                    <Link to="/meals" className={`btn ${isActive('/meals') ? 'btn-active' : ''}`}>
                        browse
                    </Link>
                    <Link to="/meals/create" className="btn-primary btn">
                        + create meal
                    </Link>
                    <span style={{
                        fontSize:   '13px',
                        color:      'var(--text-muted)',
                        padding:    '0 8px'
                    }}>
                        {user?.name}
                    </span>
                    <button className="btn" onClick={handleLogout}>
                        log out
                    </button>
                </div>
            )}
        </nav>
    )
}