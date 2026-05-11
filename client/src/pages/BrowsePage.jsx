import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { TAGS } from '../lib/constants'
import MealCard from '../components/MealCard'
import styles from '../styles/BrowsePage.module.css'

export default function BrowsePage() {
    const [meals, setMeals]         = useState([])
    const [activeTag, setActiveTag] = useState(null)
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState(null)

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const path = activeTag ? `/meals?tag=${encodeURIComponent(activeTag)}` : '/meals'
                const data = await api.get(path)
                setMeals(data)
            } catch {
                setError('Could not load meals')
            } finally {
                setLoading(false)
            }
        }
        fetchMeals()
    }, [activeTag]) // refetch when tage changes

    const handleTag = (tag) => setActiveTag(prev => prev === tag ? null : tag) // toggle

    if (loading)    return <p>Loading...</p>
    if (error)      return <p>{error}</p>

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Browse Meals</h1>
            {/* Tag filters */}
            <div className={styles.tagBar}>
                {TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTag(tag)}
                        className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
                    >
                        {tag}
                    </button>
                ))}
                <button
                    className="btn"
                    onClick={() => setActiveTag(null)}
                    style={{ visibility: activeTag ? 'visible' : 'hidden' }}
                >
                    Clear
                </button>
            </div>
            {/* Meal grid */}
            <div className={styles.grid}>
                {meals.length === 0
                    ? <p className={styles.empty}>No meals found</p>
                    : meals.map(meal => (
                        <MealCard key={meal._id} meal={meal}/>
                        ))
                    }
            </div>
        </div>
    )
}