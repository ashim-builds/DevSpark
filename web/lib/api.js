const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
}

async function fetchAPI(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: credentials }),
  verify: () => fetchAPI('/auth/verify'),
};

// Projects API
export const projectsAPI = {
  getAll: () => fetchAPI('/projects'),
  getById: (id) => fetchAPI(`/projects/${id}`),
  create: (data) => fetchAPI('/projects', { method: 'POST', body: data }),
  update: (id, data) => fetchAPI(`/projects/${id}`, { method: 'PUT', body: data }),
  delete: (id) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
};

// Team Members API
export const teamAPI = {
  getAll: () => fetchAPI('/team'),
  getById: (id) => fetchAPI(`/team/${id}`),
  create: (data) => fetchAPI('/team', { method: 'POST', body: data }),
  update: (id, data) => fetchAPI(`/team/${id}`, { method: 'PUT', body: data }),
  delete: (id) => fetchAPI(`/team/${id}`, { method: 'DELETE' }),
};

// Services API
export const servicesAPI = {
  getAll: () => fetchAPI('/services'),
  getById: (id) => fetchAPI(`/services/${id}`),
  create: (data) => fetchAPI('/services', { method: 'POST', body: data }),
  update: (id, data) => fetchAPI(`/services/${id}`, { method: 'PUT', body: data }),
  delete: (id) => fetchAPI(`/services/${id}`, { method: 'DELETE' }),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => fetchAPI('/testimonials'),
  getById: (id) => fetchAPI(`/testimonials/${id}`),
  create: (data) => fetchAPI('/testimonials', { method: 'POST', body: data }),
  update: (id, data) => fetchAPI(`/testimonials/${id}`, { method: 'PUT', body: data }),
  delete: (id) => fetchAPI(`/testimonials/${id}`, { method: 'DELETE' }),
};

// Contact API
export const contactAPI = {
  getAll: () => fetchAPI('/contact'),
  submit: (data) => fetchAPI('/contact', { method: 'POST', body: data }),
  delete: (id) => fetchAPI(`/contact/${id}`, { method: 'DELETE' }),
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => fetchAPI('/dashboard/stats'),
};
