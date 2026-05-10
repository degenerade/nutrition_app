import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import MealCard from '../components/MealCard'

const TAGS = ['healthy', 'vegan', 'vegetarian', 'high protein', 'low carb', 'bulking']

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
        <div>
            <h1>Browse Meals</h1>

            {/* Tag filters */}
            <div>
                {TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTag(tag)}
                        style={{ fontWeight: activeTag === tag ? 'bold' : 'normal' }}
                    >
                        {tag}
                    </button>
                ))}
                {activeTag && <button onClick={() => setActiveTag(null)}>Clear</button>}
            </div>

            {/* Meal grid */}
            {meals.length === 0
              ? <p>No meals found</p>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
                    {meals.map(meal => (
                        <MealCard key={meal._id} meal={meal}/>
                    ))}

                </div>

            }
        </div>
    )
}