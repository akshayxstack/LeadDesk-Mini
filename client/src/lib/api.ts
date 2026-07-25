import { LeadFormData } from './validation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface SubmitLeadResponse {
  id: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface MeResponse {
  username: string;
}

export interface FetchLeadsResponse {
  leads: LeadItem[];
}

export interface UpdateStatusResponse {
  id: string;
  status: 'New' | 'Contacted' | 'Closed';
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || 'An unexpected error occurred.';
    throw new ApiError(errorMsg, response.status);
  }

  return data as T;
}

export const api = {
  // POST /api/leads
  submitLead: async (leadData: LeadFormData): Promise<SubmitLeadResponse> => {
    return request<SubmitLeadResponse>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  },

  // POST /api/auth/login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  // POST /api/auth/register
  register: async (username: string, password: string): Promise<LoginResponse> => {
    return request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  // GET /api/auth/me
  getMe: async (token: string): Promise<MeResponse> => {
    return request<MeResponse>('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // GET /api/leads
  getLeads: async (token: string, search: string = ''): Promise<FetchLeadsResponse> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<FetchLeadsResponse>(`/api/leads${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // PATCH /api/leads/:id/status
  updateLeadStatus: async (token: string, id: string, status: string): Promise<UpdateStatusResponse> => {
    return request<UpdateStatusResponse>(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  }
};
