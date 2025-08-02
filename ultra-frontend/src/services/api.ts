// 🚀 ULTRA-ADVANCED API SERVICE
// Revolutionary API client with smart caching, retry logic, and offline support

import { useUserStore } from '../store';
import { User, Event, Ticket, VenueSection } from '../types';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class UltraAPIClient {
  private baseURL: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryDelays: number[] = [1000, 2000, 4000]; // Exponential backoff
  
  constructor(baseURL: string = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  // 🎯 Smart caching with TTL
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // 🔄 Retry logic with exponential backoff
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries) throw error;
        
        const delay = this.retryDelays[Math.min(i, this.retryDelays.length - 1)];
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  // 🛡️ Enhanced request method with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true,
    cacheTTL: number = 300000
  ): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
    
    // Check cache first for GET requests
    if (options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE' && useCache) {
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;
    }

    const token = useUserStore.getState().token;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    return this.executeWithRetry(async () => {
      const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || 'Request failed',
          response.status,
          errorData.code,
          errorData
        );
      }

      const data = await response.json();
      
      // Cache successful GET requests
      if ((!options.method || options.method === 'GET') && useCache) {
        this.setCachedData(cacheKey, data, cacheTTL);
      }

      return data;
    });
  }

  // 👤 Authentication APIs
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<{ user: User; token: string }> {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  }

  async refreshToken(): Promise<{ token: string }> {
    return this.request('/auth/refresh/', {
      method: 'POST',
    }, false);
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout/', {
      method: 'POST',
    }, false);
  }

  // 🎭 Events APIs
  async getEvents(filters?: {
    category?: string;
    search?: string;
    date?: string;
    location?: string;
  }): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const endpoint = `/events/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint, {}, true, 600000); // Cache for 10 minutes
  }

  async getEventById(id: string): Promise<Event> {
    return this.request(`/events/${id}/`, {}, true, 300000); // Cache for 5 minutes
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    return this.request('/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }, false);
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    return this.request(`/events/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }, false);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request(`/events/${id}/`, {
      method: 'DELETE',
    }, false);
  }

  // 🏟️ Venue APIs
  async getVenueLayout(eventId: string): Promise<VenueSection[]> {
    return this.request(`/events/${eventId}/venue/`, {}, true, 1800000); // Cache for 30 minutes
  }

  async getAvailableSeats(eventId: string, sectionId?: string): Promise<any> {
    const endpoint = sectionId 
      ? `/events/${eventId}/seats/?section=${sectionId}`
      : `/events/${eventId}/seats/`;
    return this.request(endpoint, {}, true, 60000); // Cache for 1 minute (frequently updated)
  }

  // 🎫 Tickets APIs
  async getUserTickets(): Promise<Ticket[]> {
    return this.request('/my-tickets/', {}, true, 120000); // Cache for 2 minutes
  }

  async bookTickets(eventId: string, ticketData: {
    seats?: string[];
    section?: string;
    quantity: number;
    paymentInfo: any;
  }): Promise<Ticket[]> {
    return this.request(`/events/${eventId}/book/`, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }, false);
  }

  async validateTicket(validationToken: string): Promise<{
    success: boolean;
    ticket: Ticket;
    message: string;
  }> {
    return this.request(`/validate-ticket/${validationToken}/`, {
      method: 'POST',
    }, false);
  }

  async transferTicket(ticketId: string, recipientEmail: string): Promise<void> {
    return this.request(`/tickets/${ticketId}/transfer/`, {
      method: 'POST',
      body: JSON.stringify({ recipientEmail }),
    }, false);
  }

  // 📊 Organizer Dashboard APIs
  async getOrganizerEvents(): Promise<Event[]> {
    return this.request('/organizer/events/', {}, true, 300000);
  }

  async getEventStats(eventId: string): Promise<{
    totalTickets: number;
    soldTickets: number;
    revenue: number;
    checkedInTickets: number;
    recentActivity: any[];
  }> {
    return this.request(`/organizer/events/${eventId}/stats/`, {}, true, 60000);
  }

  async getEventTickets(eventId: string): Promise<Ticket[]> {
    return this.request(`/organizer/events/${eventId}/tickets/`, {}, true, 120000);
  }

  async bulkValidateTickets(validationTokens: string[]): Promise<any> {
    return this.request('/bulk-validate/', {
      method: 'POST',
      body: JSON.stringify({ tokens: validationTokens }),
    }, false);
  }

  // 🔍 Search APIs
  async searchEvents(query: string): Promise<Event[]> {
    return this.request(`/events/search/?q=${encodeURIComponent(query)}`, {}, true, 180000);
  }

  async getRecommendations(): Promise<Event[]> {
    return this.request('/recommendations/', {}, true, 900000); // Cache for 15 minutes
  }

  // 📱 Device APIs
  async registerDevice(deviceInfo: {
    token: string;
    platform: 'ios' | 'android';
    version: string;
  }): Promise<void> {
    return this.request('/devices/register/', {
      method: 'POST',
      body: JSON.stringify(deviceInfo),
    }, false);
  }

  // 🔔 Notifications APIs
  async getNotifications(): Promise<any[]> {
    return this.request('/notifications/', {}, true, 60000);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this.request(`/notifications/${notificationId}/read/`, {
      method: 'POST',
    }, false);
  }

  // 🧹 Cache management
  clearCache(): void {
    this.cache.clear();
  }

  clearCacheByPattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// 🌟 Export singleton instance
export const apiClient = new UltraAPIClient();

// 🎯 React Query setup for even more advanced caching
export const queryKeys = {
  events: ['events'] as const,
  event: (id: string) => ['events', id] as const,
  userTickets: ['tickets', 'user'] as const,
  venueLayout: (eventId: string) => ['venue', eventId] as const,
  availableSeats: (eventId: string, sectionId?: string) => 
    ['seats', eventId, sectionId] as const,
  organizerEvents: ['organizer', 'events'] as const,
  eventStats: (eventId: string) => ['organizer', 'stats', eventId] as const,
  recommendations: ['recommendations'] as const,
  notifications: ['notifications'] as const,
};

// 🎪 WebSocket connection for real-time updates
class RealTimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): void {
    const token = useUserStore.getState().token;
    if (!token) return;

    try {
      this.ws = new WebSocket(`ws://localhost:8000/ws/events/?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('🚀 WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleRealTimeUpdate(data: any): void {
    // Handle different types of real-time updates
    switch (data.type) {
      case 'seat_updated':
        // Clear seat cache to force refresh
        apiClient.clearCacheByPattern('seats');
        break;
      case 'event_updated':
        // Clear event cache
        apiClient.clearCacheByPattern(`events/${data.eventId}`);
        break;
      case 'ticket_sold':
        // Update available seats
        apiClient.clearCacheByPattern('seats');
        break;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const realTimeService = new RealTimeService();
