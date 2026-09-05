import axios from 'axios';

// Backend API base URL comes from the environment (see .env.example)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Attach the JWT on every request when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Normalizes API/axios errors into a single Error with a user-facing message.
 */
function toUserError(err) {
  if (err.response) {
    const msg =
      err.response.data?.error ||
      err.response.data?.message ||
      `Request failed (${err.response.status})`;
    const e = new Error(msg);
    e.status = err.response.status;
    throw e;
  }
  if (err.request) {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  throw err;
}

// ---------------- Wines ----------------
export const winesService = {
  async list(params = {}) {
    try {
      const { data } = await api.get('/wines', { params });
      return data; // { success, count, total, page, pages, data }
    } catch (err) {
      toUserError(err);
    }
  },

  async search(q) {
    try {
      const { data } = await api.get('/wines/search', { params: { q } });
      return data;
    } catch (err) {
      toUserError(err);
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/wines/${id}`);
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },

  async getFilterOptions() {
    try {
      const { data } = await api.get('/wines/meta/options');
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },

  create(payload) {
    return api.post('/wines', payload).then((r) => r.data.data).catch(toUserError);
  },
  update(id, payload) {
    return api.put(`/wines/${id}`, payload).then((r) => r.data.data).catch(toUserError);
  },
  remove(id) {
    return api.delete(`/wines/${id}`).then((r) => r.data).catch(toUserError);
  },
};

// ---------------- Auth ----------------
export const authService = {
  async register(payload) {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data; // { success, token, user }
    } catch (err) {
      toUserError(err);
    }
  },
  async login(payload) {
    try {
      const { data } = await api.post('/auth/login', payload);
      return data;
    } catch (err) {
      toUserError(err);
    }
  },
  async me() {
    try {
      const { data } = await api.get('/auth/me');
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },
};

// ---------------- Favorites ----------------
export const favoritesService = {
  async list() {
    try {
      const { data } = await api.get('/favorites');
      return data.data; // wine documents
    } catch (err) {
      toUserError(err);
    }
  },
  async add(wineId) {
    try {
      const { data } = await api.post(`/favorites/${wineId}`);
      return data;
    } catch (err) {
      toUserError(err);
    }
  },
  async remove(wineId) {
    try {
      const { data } = await api.delete(`/favorites/${wineId}`);
      return data;
    } catch (err) {
      toUserError(err);
    }
  },
};

// ---------------- Reviews ----------------
export const reviewsService = {
  async listForWine(wineId, params = {}) {
    try {
      const { data } = await api.get(`/wines/${wineId}/reviews`, { params });
      return data; // { success, count, total, page, pages, data }
    } catch (err) {
      toUserError(err);
    }
  },
  async create(wineId, payload) {
    try {
      const { data } = await api.post(`/wines/${wineId}/reviews`, payload);
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },
  async update(reviewId, payload) {
    try {
      const { data } = await api.put(`/reviews/${reviewId}`, payload);
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },
  async remove(reviewId) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return true;
    } catch (err) {
      toUserError(err);
    }
  },
  async mine() {
    try {
      const { data } = await api.get('/reviews/mine');
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },
};

// ---------------- Countries / grapes ----------------
export const metaService = {
  async countries() {
    try {
      const { data } = await api.get('/countries');
      return data.data; // [{ name, count, avgRating, image }]
    } catch (err) {
      toUserError(err);
    }
  },
  async grapes() {
    try {
      const { data } = await api.get('/countries/grapes');
      return data.data;
    } catch (err) {
      toUserError(err);
    }
  },
};

export default api;
