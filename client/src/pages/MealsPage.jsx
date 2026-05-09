import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

export default function MealsPage() {
    const { logout } = useAuth()

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState(null)
    const [mealName, setMealName] = useState('')
    const [meals, setMeals] = useState([])
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        if (!query.trim()) return
        try {
            const data = await api.get(`nutrition/${query}`)
            setResults(data)
            setSelected(null)
            setError(null)
        } catch {
            setError('Search failed, try again')
        }
    }

    const handleSelect = (food) => {
        setSelected(food)
        setResults([])
        setQuery('')
    }

    const handleAddmeal = async () => {
        if (!selected ||!mealName.trim()) return
        try {
            const meal = { name: mealName, food: selected }
            await api.post('/meals', meal)
            setMeals(prev => [...prev, meals])
            setSelected(null)
            setMealName('')
            setError(null)
        } catch {
            setError('Could not save meal')
        }
    }

    return (
        <div>
            <button onClick={logout}>Log out</button>

            {/* search */}
            <input
                value={query}
                onClick={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search food..."
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p>{error}</p>}

            {/* Search results */}
            {results.map(food => (
                <div key={food.fdcId} onClick={() => handleSelect(food)}>
                    {food.name} ({food.category})
                </div>
            ))}

            {/* selected food + save as meal */}
            {selected && (
                <div>
                    <p>{selected.name}</p>
                    <p>Calories: {selected.per100g.calories}kcal</p>
                    <p>Protein: {selected.per100g.protein}g</p>
                    <p>Carbs: {selected.per100g.carbs}g</p>
                    <p>Fat: {selected.per100g.fat}g</p>

                    <input
                        value={mealName}
                        onChange={e => setMealName(e.target.value)}
                        placeholder="Name this meal..."
                    />
                    <button onClick={handleAddmeal}>Save meal</button>
                </div>
            )}

            {/* Saved meals list */}
            {meals.map((meal, i) => (
                <div key={i}>
                    <p>{meal.name}</p>
                    <p>{meal.food.per100g.calories}kcal</p>
                </div>
            ))}
        </div>
    )
}