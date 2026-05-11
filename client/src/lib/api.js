const BASE = '/api'

const getToken = () => localStorage.getItem('token')

const request = async (path, options = {}) => {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Controll': 'no-cache, no-store',
            'Pragma': 'no-cache',
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            ...options.headers,
        },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
}

export const api = {
    get:    (path)          => request(path),
    post:   (path, body)    => request(path, { method: 'POST',  body: JSON.stringify(body) }),
    patch:  (path, body)    => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path)          => request(path, { method: 'DELETE' }),
}