// 🎯 ULTRA-ADVANCED TICKETING SYSTEM TYPES
// Revolutionary TypeScript definitions for the most advanced ticketing experience

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'organizer' | 'admin';
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  preferredLanguage: string;
  personalizedRecommendations: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  organizer: User;
  images: string[];
  venue: Venue;
  pricing: TicketPricing[];
  tags: string[];
  isActive: boolean;
}

export type EventCategory = 
  | 'concert' 
  | 'conference' 
  | 'sports' 
  | 'theater' 
  | 'comedy' 
  | 'other';

export interface Venue {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  layout: VenueLayout;
  amenities: string[];
  images: string[];
  virtualTour?: string;
}

export interface VenueLayout {
  sections: VenueSection[];
  entrances: Entrance[];
  facilities: Facility[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface VenueSection {
  id: string;
  name: string;
  type: 'seating' | 'standing' | 'vip' | 'accessibility';
  capacity: number;
  seats?: Seat[];
  priceCategory: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  type: 'standard' | 'premium' | 'accessible' | 'restricted';
  isAvailable: boolean;
  isSelected: boolean;
  isReserved: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
  viewQuality: 1 | 2 | 3 | 4 | 5; // 5 stars rating
  price: number;
}

export interface Entrance {
  id: string;
  name: string;
  type: 'main' | 'vip' | 'accessibility' | 'emergency';
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  type: 'restroom' | 'concession' | 'bar' | 'merchandise' | 'information';
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface TicketPricing {
  id: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  benefits: string[];
  isAvailable: boolean;
  maxQuantity: number;
}

export interface Ticket {
  id: string;
  event: Event;
  user: User;
  seat?: Seat;
  section: VenueSection;
  qrCode: string;
  validationToken: string;
  status: TicketStatus;
  purchaseDate: string;
  price: number;
  currency: string;
  metadata?: {
    transferredFrom?: string;
    specialRequests?: string[];
    addOns?: TicketAddOn[];
  };
}

export type TicketStatus = 
  | 'pending' 
  | 'paid' 
  | 'cancelled' 
  | 'used' 
  | 'transferred';

export interface TicketAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'merchandise' | 'parking' | 'upgrade' | 'experience';
}

// 🎨 UI Component Types
export interface AnimationConfig {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  delay?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  gradient: {
    start: string;
    end: string;
  };
}

export interface Navigation {
  screen: string;
  params?: Record<string, any>;
  animation?: 'slide' | 'fade' | 'push' | 'modal' | 'flip';
}

// 🚀 Advanced Features
export interface AR_Experience {
  id: string;
  type: 'seat_preview' | 'venue_navigation' | 'event_info';
  modelUrl: string;
  anchors: ARAnchor[];
  interactions: ARInteraction[];
}

export interface ARAnchor {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ARInteraction {
  id: string;
  type: 'tap' | 'pinch' | 'swipe' | 'long_press';
  action: string;
  feedback: 'haptic' | 'audio' | 'visual';
}

export interface RealTimeUpdate {
  type: 'seat_selected' | 'seat_released' | 'ticket_sold' | 'event_updated';
  data: any;
  timestamp: string;
  userId?: string;
}

export interface Analytics {
  eventId: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
