export default function MealCard({ meal }) {
    return (
        <div className="card">
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
                P {Math.round(meal.totals.protein)}g ▪️ C {Math.round(meal.totals.carbs)}g ▪️ F {Math.round(meal.totals.far)}g
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
        </div>
    )
}