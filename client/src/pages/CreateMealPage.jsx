import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { TAGS, FOOD_CATEGORIES } from '../lib/constants'
import styles from '../styles/CreateMealPage.module.css'

export default function CreateMealPage() {
    const navigate = useNavigate()

    const [name, setName]                   = useState('')
    const [selectedTags, setSelectedTags]   = useState([])
    const [query, setQuery]                 = useState('')
    const [results, setResults]             = useState([])
    const [ingredients, setIngredients]     = useState([]) // fdcId, name, amount, per100g
    const [error, setError]                 = useState(null)
    const [saving, setSaving]               = useState(false)
    const [category, setCategory]           = useState('')

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const handleSearch = async () => {
        if (!query.trim()) return
        try {
            const path = category
                ? `/ingredient/${encodeURIComponent(query)}?category=${encodeURIComponent(category)}`
                : `/ingredient/${encodeURIComponent(query)}`
            const data = await api.get(path)
            setResults(data)
            setError(null)
        } catch {
            setError('Search failed')
        }
    }

    const handleAddIngredient = (food) => {
        //duplicates
        if (ingredients.find(i => i.fdcId === food.fdcId)) {
            setResults([])
            setQuery('')
            return
        }
        setIngredients(prev => [...prev, { ...food, amount: 100 }]) //default 100g
        setResults([])
        setQuery('')
    }

    const handleAmountChange = (fdcId, value) => {
        setIngredients(prev =>
            prev.map(i => i.fdcId === fdcId ? { ...i, amount: Number(value) } : i)
        )
    }

    const handleRemove = (fdcId) => {
        setIngredients(prev => prev.filter(i => i.fdcId !== fdcId))
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
        <div className={styles.container}>
            <h1 className={styles.title}>Create Meal</h1>

            {/* meal name */}
            <div className={styles.section}>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Meal name..."
                />
            </div>

            {/* tags */}
            <div className={styles.section}>
                <p className="section-label">Tags</p>
                <div className={styles.tagRow}>
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* category filter */}
            <div className={styles.section}>
                <p className="section-label">Category</p>
                <div className={styles.categoryRow}>
                    {FOOD_CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`tag-btn ${category === cat.value ? 'active' : ''}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ingredient search */}
            <div className={styles.section}>
                <p className="section-label">Search ingredient</p>
                <div className={styles.searchRow}>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Search ingredient..."
                    />
                    <button
                        className={`btn btn.primary ${styles.searchBtn}`}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {results.length > 0 && (
                    <div className={`card ${styles.results}`}>
                        {results.map(food => (
                            <div
                                key={food.fdcId}
                                className={styles.resultsItem}
                                onClick={() => handleAddIngredient(food)}
                            >
                                {food.name}
                                <span className={styles.resultCategory}>{food.category}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ingredient list */}
            {ingredients.length > 0 && (
                <div className={styles.section}>
                    <p className="section-label">Ingredients</p>
                    <div className={`card ${styles.ingredients}`}>
                        {ingredients.map(ing => (
                            <div key={ing.fdcId} className={styles.ingredientRow}>
                                <span className={styles.ingredientName}>{ing.name}</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={ing.amount}
                                    className={styles.amountInput}
                                    onChange={e => handleAmountChange(ing.fdcId, e.target.value)}
                                />
                                <span className={styles.unit}>g</span>
                                <button
                                    className={`btn ${styles.removeBtn}`}
                                    onClick={() => handleRemove(ing.fdcId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* live ing preview */}
            {ingredients.length > 0 && (
                <div className={styles.section}>
                    <p className="section-label">Nutrition preview</p>
                    <div className="nutrition-preview">
                        <div>
                            <p className="label">Calories</p>
                            <p className="value">{Math.round(preview.calories)}kcal</p>
                        </div>
                        <div>
                            <p className="label">Protein</p>
                            <p className="value">{Math.round(preview.protein)}g</p>
                        </div>
                        <div>
                            <p className="label">Carbs</p>
                            <p className="value">{Math.round(preview.carbs)}g</p>
                        </div>
                        <div>
                            <p className="label">Fat</p>
                            <p className="value">{Math.round(preview.fat)}g</p>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button
                className={`btn btn-primary ${styles.saveBtn}`}
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save meal'}
            </button>
        </div>
    )
}