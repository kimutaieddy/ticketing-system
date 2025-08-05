import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import EventsScreen from '../src/screens/EventsScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('EventsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = renderWithNavigation(<EventsScreen />);
    
    expect(getByText('Events')).toBeTruthy();
    expect(getByText('Discover amazing events near you')).toBeTruthy();
  });

  it('displays all events', () => {
    const { getByText } = renderWithNavigation(<EventsScreen />);
    
    expect(getByText('Summer Music Festival')).toBeTruthy();
    expect(getByText('Tech Conference 2025')).toBeTruthy();
    expect(getByText('Food & Wine Festival')).toBeTruthy();
  });

  it('displays event details correctly', () => {
    const { getByText } = renderWithNavigation(<EventsScreen />);
    
    // Check prices
    expect(getByText('$99')).toBeTruthy();
    expect(getByText('$149')).toBeTruthy();
    expect(getByText('$75')).toBeTruthy();
    
    // Check dates
    expect(getByText('August 15, 2025')).toBeTruthy();
    expect(getByText('September 10, 2025')).toBeTruthy();
    expect(getByText('October 5, 2025')).toBeTruthy();
    
    // Check locations
    expect(getByText('Central Park')).toBeTruthy();
    expect(getByText('Convention Center')).toBeTruthy();
    expect(getByText('Downtown Plaza')).toBeTruthy();
  });

  it('navigates to EventDetails when event is pressed', () => {
    const { getByText } = renderWithNavigation(<EventsScreen />);
    
    const eventCard = getByText('Summer Music Festival');
    fireEvent.press(eventCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('EventDetails', { eventId: 1 });
  });

  it('displays event descriptions', () => {
    const { getByText } = renderWithNavigation(<EventsScreen />);
    
    expect(getByText('The biggest music festival of the summer!')).toBeTruthy();
    expect(getByText('Learn about the latest in technology.')).toBeTruthy();
    expect(getByText('Taste amazing food and wine from local vendors.')).toBeTruthy();
  });
});
