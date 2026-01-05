const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || '요청에 실패했습니다.');
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    signup: async (email: string, password: string, nickname: string) => {
      return fetchApi<{ token: string; user: any }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, nickname }),
      });
    },
    login: async (email: string, password: string) => {
      return fetchApi<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    getMe: async () => {
      return fetchApi<any>('/auth/me');
    },
    updateMe: async (updates: any) => {
      return fetchApi<any>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  },

  // Agendas
  agendas: {
    getAll: async (params?: { status?: string; category?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      const queryString = query.toString();
      return fetchApi<any[]>(`/agendas${queryString ? `?${queryString}` : ''}`);
    },
    getById: async (id: number) => {
      return fetchApi<any>(`/agendas/${id}`);
    },
    create: async (data: any) => {
      return fetchApi<any>('/agendas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // Regional Data
  regional: {
    getCities: async () => {
      return fetchApi<any[]>('/regional/cities');
    },
    getDistricts: async (cityId: string) => {
      return fetchApi<any[]>(`/regional/cities/${cityId}/districts`);
    },
    getDistrict: async (districtId: number) => {
      return fetchApi<any>(`/regional/districts/${districtId}`);
    },
    getAll: async () => {
      return fetchApi<any[]>('/regional/all');
    },
  },

  // Questions
  questions: {
    getAll: async (category?: string) => {
      const query = category ? `?category=${category}` : '';
      return fetchApi<any[]>(`/questions${query}`);
    },
    getById: async (id: number) => {
      return fetchApi<any>(`/questions/${id}`);
    },
  },

  // Politicians
  politicians: {
    getAll: async () => {
      return fetchApi<any[]>('/politicians');
    },
    getById: async (id: number) => {
      return fetchApi<any>(`/politicians/${id}`);
    },
  },

  // Comments
  comments: {
    getByAgenda: async (agendaId: number) => {
      return fetchApi<any[]>(`/comments/agenda/${agendaId}`);
    },
    create: async (agendaId: number, content: string, stance: 'agree' | 'disagree') => {
      return fetchApi<any>('/comments', {
        method: 'POST',
        body: JSON.stringify({ agendaId, content, stance }),
      });
    },
    like: async (commentId: number) => {
      return fetchApi<{ liked: boolean }>(`/comments/${commentId}/like`, {
        method: 'POST',
      });
    },
  },

  // Votes
  votes: {
    voteAgenda: async (agendaId: number, stance: 'agree' | 'disagree') => {
      return fetchApi<any>('/votes/agenda', {
        method: 'POST',
        body: JSON.stringify({ agendaId, stance }),
      });
    },
    voteRegional: async (candidateId: number) => {
      return fetchApi<any>('/votes/regional', {
        method: 'POST',
        body: JSON.stringify({ candidateId }),
      });
    },
  },
};

export default api;
