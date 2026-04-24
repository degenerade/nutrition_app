import { useState } from 'react'
import './App.css'
//import { set } from 'mongoose'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)

  const handleSearch = async () => {
    const response = await fetch(`/api/nutrition/${query}`)
    const data = await response.json()
    setResults(data)
    setSelected(null)
  }

  const handleSelect = (food) => {
    setSelected(food)
    setResults([])
  }

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {results.map(food => (
        <div id='foodSelect' key={food.fdcId} onClick={() => handleSelect(food)}>
          {food.name}; ({food.category})
        </div>
      ))}

      {selected && (
        <div>
          <p>{selected.name}</p>
          <p>Calories: {selected.per100g.calories}kcal</p>
          <p>Protein: {selected.per100g.protein}g</p>
          <p>Carbs: {selected.carbs}g</p>
          <p>Fat: {selected.fat}g</p>
        </div>
      )}
    </div>
  )
}

export default App