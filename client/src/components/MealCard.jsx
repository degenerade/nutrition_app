import { useState } from "react"
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { TAGS } from '../lib/constants'

export default function MealCard({ meal, onDelete, onUpdate }) {
    const { user } = useAuth()
    const [editing, setEditing]= useState(false)
    const [name, setName]= useState(meal.name)
    const [tags, setTags]= useState(meal.tags)
    const [loading, setLoading]= useState(false)
    const [error, setError]= useState(null)

    console.log('user:', user, 'createdBy:', meal.createdBy)

    const isOwner = user?.id === meal.createdBy

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${meal.name}"?`)) return
        try {
            setLoading(true)
            await api.delete(`/meals/${meal._id}`)
            onDelete(meal._id)
        } catch {
            setError('Could not delete meal')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        try {
            setLoading(true)
            const updated = await api.patch(`/meals/${meal._id}`, { name, tags })
            onUpdate(updated)
            setEditing(false)
            setLoading(false)
        } catch {
            setError('Could not update meal')
        } finally {
            setLoading(false)
        }
    }

    const handleTagToggle = (tag) => {
        setTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    if (editing) return (
        <div className="card">
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ marginBottom: '8px' }}
            />
            <div
                style={{
                    display:        'flex',
                    flexWrap:       'wrap',
                    gap:            '4px',
                    marginBottom:   '8px'
                }} 
            >
                {TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`tag-btn ${tags.includes(tag) ? 'active' : ''}`}
                        style={{
                            fontSize:   '11px',
                            padding:    '3px 8px'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                    className="btn"
                    onClick={() => setEditing(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{
                fontSize:       '14px',
                fontWeight:     '500',
                color:          'var(--text-primary)',
                marginBottom:   '4px'
            }}>
                {meal.name}
            </p>
            <p style={{
                fontSize:       '22px',
                fontWeight:     '500',
                color:          'var(--accent)',
                marginBottom:   '6px'
            }}>
                {Math.round(meal.totals.calories)}kcal
            </p>
            <p style={{
                fontSize:       '12px',
                color:          'var(--text-secondary)',
                marginBottom:   '10px'
            }}>
                P {Math.round(meal.totals.protein)}g ▪️ C {Math.round(meal.totals.carbs)}g ▪️ F {Math.round(meal.totals.fat)}g
            </p>
            <div style={{
                display:    'flex',
                gap:        '4px',
                flexWrap:   'wrap'
            }}>
                {meal.tags.map(tag => (
                    <span key={tag} className="pill">{tag}</span>
                ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '8px' }}>
                {isOwner && (
                    <div>
                        <button className="btn" onClick={() => setEditing(true)}
                            style={{ fontSize: '12px', padding: '4px 10px'}}>
                            edit
                        </button>
                        <button className="btn" onClick={handleDelete} disabled={loading}
                            style={{ fontSize: '12px', padding: '4px 10px', color: '#ff6b6b', borderColor: '#ff6b6b'}}>
                            {loading ? '...' : 'delete'}
                        </button>
                    </div>
                )}
            </div>
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
        </div>
    )
}