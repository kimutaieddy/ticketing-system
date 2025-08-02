// 🚀 ULTRA-ADVANCED STATE MANAGEMENT
// Revolutionary Zustand store with persistent data and real-time updates

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { User, Event, Ticket, VenueSection, Seat, ThemeColors } from '../types';

// MMKV storage for ultra-fast persistence
const storage = new MMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

// 🎨 Theme Store - Dynamic theming with smooth transitions
interface ThemeState {
  currentTheme: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  animations: boolean;
  hapticFeedback: boolean;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleAnimations: () => void;
  toggleHaptic: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'auto',
      animations: true,
      hapticFeedback: true,
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1F2937',
        textSecondary: '#9CA3AF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: {
          start: '#6366F1',
          end: '#8B5CF6',
        },
      },
      setTheme: (theme) => set({ currentTheme: theme }),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleHaptic: () => set((state) => ({ hapticFeedback: !state.hapticFeedback })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// 👤 User Store - Authentication and user management
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// 🎫 Events Store - Event management with real-time updates
interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  filters: {
    category: string | null;
    dateRange: [Date, Date] | null;
    priceRange: [number, number] | null;
    location: string | null;
  };
  searchQuery: string;
  isLoading: boolean;
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  setFilters: (filters: Partial<EventsState['filters']>) => void;
  setSearchQuery: (query: string) => void;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
}

export const useEventsStore = create<EventsState>()((set, get) => ({
  events: [],
  selectedEvent: null,
  filters: {
    category: null,
    dateRange: null,
    priceRange: null,
    location: null,
  },
  searchQuery: '',
  isLoading: false,
  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (eventId, updates) => set((state) => ({
    events: state.events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ),
    selectedEvent: state.selectedEvent?.id === eventId 
      ? { ...state.selectedEvent, ...updates } 
      : state.selectedEvent
  })),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const token = useUserStore.getState().token;
      const response = await fetch('http://localhost:8000/api/events/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const events = await response.json();
      set({ events, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  fetchEventById: async (id) => {
    set({ isLoading: true });
    try {
      const token = useUserStore.getState().token;
      const response = await fetch(`http://localhost:8000/api/events/${id}/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const event = await response.json();
      set({ selectedEvent: event, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

// 🎟️ Tickets Store - Ticket management with booking flow
interface TicketsState {
  tickets: Ticket[];
  selectedSeats: Seat[];
  bookingFlow: {
    step: 'select_seats' | 'review' | 'payment' | 'confirmation';
    eventId: string | null;
    sectionId: string | null;
    quantity: number;
  };
  isLoading: boolean;
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  setBookingFlow: (flow: Partial<TicketsState['bookingFlow']>) => void;
  resetBooking: () => void;
  fetchUserTickets: () => Promise<void>;
  bookTickets: (paymentInfo: any) => Promise<void>;
}

export const useTicketsStore = create<TicketsState>()((set, get) => ({
  tickets: [],
  selectedSeats: [],
  bookingFlow: {
    step: 'select_seats',
    eventId: null,
    sectionId: null,
    quantity: 1,
  },
  isLoading: false,
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  addSeat: (seat) => set((state) => ({ 
    selectedSeats: [...state.selectedSeats, { ...seat, isSelected: true }] 
  })),
  removeSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(seat => seat.id !== seatId)
  })),
  setBookingFlow: (flow) => set((state) => ({ 
    bookingFlow: { ...state.bookingFlow, ...flow } 
  })),
  resetBooking: () => set({
    selectedSeats: [],
    bookingFlow: {
      step: 'select_seats',
      eventId: null,
      sectionId: null,
      quantity: 1,
    },
  }),
  fetchUserTickets: async () => {
    set({ isLoading: true });
    try {
      const token = useUserStore.getState().token;
      const response = await fetch('http://localhost:8000/api/my-tickets/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const tickets = await response.json();
      set({ tickets, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  bookTickets: async (paymentInfo) => {
    set({ isLoading: true });
    try {
      const token = useUserStore.getState().token;
      const { selectedSeats, bookingFlow } = get();
      
      const response = await fetch(`http://localhost:8000/api/events/${bookingFlow.eventId}/book/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seats: selectedSeats.map(seat => seat.id),
          paymentInfo,
        }),
      });
      
      const newTickets = await response.json();
      set((state) => ({ 
        tickets: [...state.tickets, ...newTickets],
        isLoading: false 
      }));
      
      // Reset booking flow
      get().resetBooking();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

// 🎭 UI Store - UI state management for animations and interactions
interface UIState {
  isNavBarVisible: boolean;
  currentModal: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
  isOnline: boolean;
  deviceInfo: {
    hasNotch: boolean;
    screenDimensions: { width: number; height: number };
    platform: 'ios' | 'android' | 'web';
  };
  setNavBarVisible: (visible: boolean) => void;
  showModal: (modalName: string) => void;
  hideModal: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setDeviceInfo: (info: Partial<UIState['deviceInfo']>) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  isNavBarVisible: true,
  currentModal: null,
  notifications: [],
  isOnline: true,
  deviceInfo: {
    hasNotch: false,
    screenDimensions: { width: 375, height: 812 },
    platform: 'ios',
  },
  setNavBarVisible: (visible) => set({ isNavBarVisible: visible }),
  showModal: (modalName) => set({ currentModal: modalName }),
  hideModal: () => set({ currentModal: null }),
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      ...notification,
      id,
      timestamp: new Date(),
    };
    set((state) => ({ 
      notifications: [...state.notifications, newNotification] 
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  setOnlineStatus: (isOnline) => set({ isOnline }),
  setDeviceInfo: (info) => set((state) => ({ 
    deviceInfo: { ...state.deviceInfo, ...info } 
  })),
}));
