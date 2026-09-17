const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      detail = body.detail || detail
    } catch {
      // Keep the HTTP status when the API does not return JSON.
    }
    throw new Error(detail)
  }

  return response.json()
}

export const predictAttrition = (employee) => request('/predict-attrition', {
  method: 'POST',
  body: JSON.stringify([employee]),
})

export const getHealthScore = (inputs) => request('/health-score', {
  method: 'POST',
  body: JSON.stringify(inputs),
})

export const queryHrPolicies = (query) => request('/query', {
  method: 'POST',
  body: JSON.stringify({ query }),
})

export const getApiUrl = () => API_URL
