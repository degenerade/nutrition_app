import { useSate } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const TAGS = ['healthy', 'vegan', 'vegetarian', 'high protein', 'low carb', 'bulking']

export default function CreateMealPage() {
    const navigate = useNavigate()

    const [name, setName]                   = useSate('')
    const [selectedTags, setSelectedTags]   = useSate([])
    const [query, setQuery]                 = useSate('')
    const [results, SetResults]             = useSate([])
    const [ingredients, setIngredients]     = useSate([]) // fcdId, name, amount, per100g
    const [error, setError]                 = useSate(null)
    const [saving, setSaving]               = useSate(false)

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const handleSearch = async () => {
        if (!query.trim()) return
        try {
            const data = await api.get(`/nutrition/${encodeURIComponent(query)}`)
            SetResults(data)
        } catch {
            setError('Search failed')
        }
    }

    const handleAddIngredient = (food) => {
        //duplicates
        if (ingredients.find(i => i.fcdId === food.fcdId)) {
            SetResults([])
            setQuery('')
            return
        }
        setIngredients(prev => [...prev, { ...food, amount: 100 }]) //default 100g
        SetResults([])
        setQuery('')
    }

    const handleAmountChange = (fcdId, value) => {
        setIngredients(prev =>
            prev.map(i => i.fcdId === fcdId ? { ...i, amount: Number(value) } : i)
        )
    }

    const handleRemove = (fcdId) => {
        setIngredients(prev => prev.filter(i => i.fcdId !== fcdId))
    }

    const handleSave = async () => {
        if (!name.trim())               return setError('Meal needs a name')
        if (ingredients.length === 0)   return setError('Add at least one ingredient')
        try {
            setSaving(true)
            await api.post('/meals', { name, tags: selectedTags, ingredients })
            navigate('/meals')
        } catch (err) {
            setError(err.message || 'Could not save meal')
        } finally {
            setSaving(false)
        }
    }

    //live preview
    const preview = ingredients.reduce((totals, ing) => {
        const r = ing.amount / 100
        return {
            calories:   totals.calories + ing.per100g.calories  * r,
            protein:    totals.protein  + ing.per100g.protein   * r,
            carbs:      totals.carbs    + ing.per100g.carbs     * r,
            fat:        totals.fat      + ing.per100g.fat       * r
        }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0})

    return (
        <div>
            <h1>Create Meal</h1>

            {/* meal name */}
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Meal name..."
            />

            {/* tags */}
            <div>
                {TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        style={{ fontWeight: selectedTags.includes(tag) ? 'bold' : 'normal' }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* ingredient search */}
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search ingredient..."
            />
            <button onClick={handleSearch}>Search</button>

            {results.map(food => (
                <div key={food.fcdId} onClick={() => handleAddIngredient(food)}>
                    {food.name} ({food.category})
                </div>
            ))}

            {/* ingredient list */}
            {ingredients.length > 0 && (
                <div>
                    <h3>Ingredients</h3>
                    {ingredients.map(ing => (
                        <div key={ing.fcdId}>
                            <span>{ing.name}</span>
                            <input
                                type="number"
                                min="1"
                                value={ing.amount}
                                onChange={e => handleAmountChange(ing.fcdId, e.target.value)}
                            />
                            <span>g</span>
                            <button onClick={() => handleRemove(ing.fcdId)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}

            {/* live ing preview */}
            {ingredients.length > 0 && (
                <div>
                    <h3>Nutrition preview</h3>
                    <p>Calories:    {Math.round(preview.calories)}kcal</p>
                    <p>Protein:     {Math.round(preview.protein)}g</p>
                    <p>Carbs:       {Math.round(preview.carbs)}g</p>
                    <p>Fat:         {Math.round(preview.fat)}g</p>
                </div>
            )}

            {error && <p>{error}</p>}

            <button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save meal'}
            </button>
        </div>
    )
}