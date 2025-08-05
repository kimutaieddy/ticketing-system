// API Service for connecting to Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const response = await this.request('/token/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access) {
      this.setToken(response.access);
    }
    
    return response;
  }

  // Events endpoints
  async getEvents() {
    return this.request('/events/');
  }

  async createEvent(eventData) {
    return this.request('/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Tickets endpoints
  async bookTicket(eventId) {
    return this.request(`/events/${eventId}/book/`, {
      method: 'POST',
    });
  }

  async getMyTickets() {
    return this.request('/my-tickets/');
  }

  // Organizer endpoints
  async getOrganizerEvents() {
    return this.request('/organizer/events/');
  }

  async getEventStats(eventId) {
    return this.request(`/organizer/events/${eventId}/stats/`);
  }
}

export default new ApiService();
