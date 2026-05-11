let cachedToken = null
let tokenExpiry = null

const getAccessToken = async () => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken
    }

    const credentials = Buffer.from(
        `${process.env.FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch('https://oauth.fatsecret.com/connect/token', {
        method: 'POST',
        headers:{
            'Authorization':    `Basic ${credentials}`,
            'Content-Type':     'application/x-www-form-urlencoded'
        },
        body:   'grant_type=client_credentials&scope=basic'
    })

    const data = await response.json()
    cachedToken = data.access_token
    tokenExpiry = Date.now() + (data.expires_in -60) * 1000
    return cachedToken
}


export const searchIngredient = async (req, res) => {
    try {
        const { ingredient } = req.params
        const { category } = req.query

        const token = await getAccessToken()

        const response = await fetch(
            `https://platform.fatsecret.com/rest/server.api?method=foods.search.v3&search_expression={encodedURIComponent(ingredient)}&format=json&max_results=&&include_food_images=true&flag_default_serving=true`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )

        const data = await response.json()
        const foods = data.foods_search?.results?.food ?? []

        const results = foods
            .filter(food => !category || food.food_type === category)
            .map(food => {
                const serving = food.servings?.serving
                // response is array or single obj
                const defaultServing = Array.isArray(serving)
                    ? serving.find(s => s.is_default === '1') || serving[0]
                    : serving

                const per100g = defaultServing?.serving_description?.includes('100g')
                    ? defaultServing
                    : serving && Array.isArray(serving)
                        ? serving.find(s => s.serving_description === '100g') || defaultServing
                        : defaultServing
                
                        return {
                            foodId:         food.food_id,
                            name:           food.food_name,
                            brand:          food.food_brand ?? null,
                            imageUrl:       food.food_images?.food_image?.[0]?.image_url ?? null,
                            isVegan:        food.is_vegan === '1',
                            isVegetarian:   food.is_vegetarian === '1',
                            per100g:        {
                                calories:   parseFloat(per100g?.calories ?? 0),
                                protein:    parseFloat(per100g?.protein ?? 0),
                                fat:        parseFloat(per100g?.fat ?? 0),
                                carbs:      parseFloat(per100g?.carbs ?? 0),
                                fiber:      parseFloat(per100g?.fiber ?? 0),
                                sugar:      parseFloat(per100g?.sugar ?? 0)
                            }
                        }
            })
            .filter(food => food.per100g.calories > 0)

        res.json(results)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}