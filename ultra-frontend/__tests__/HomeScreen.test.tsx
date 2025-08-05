import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';

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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('Welcome!')).toBeTruthy();
    expect(getByText('Discover amazing events')).toBeTruthy();
    expect(getByText('Quick Actions')).toBeTruthy();
    expect(getByText('Featured Events')).toBeTruthy();
  });

  it('displays quick action cards', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('Browse Events')).toBeTruthy();
    expect(getByText('My Tickets')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
  });

  it('navigates to Events screen when Browse Events is pressed', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    const browseEventsButton = getByText('Browse Events');
    fireEvent.press(browseEventsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('Events');
  });

  it('navigates to MyTickets screen when My Tickets is pressed', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    const myTicketsButton = getByText('My Tickets');
    fireEvent.press(myTicketsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('MyTickets');
  });

  it('navigates to Profile screen when Profile is pressed', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    const profileButton = getByText('Profile');
    fireEvent.press(profileButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('displays featured events', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('Music Festival 2025')).toBeTruthy();
    expect(getByText('Tech Conference')).toBeTruthy();
    expect(getByText('$99')).toBeTruthy();
    expect(getByText('$149')).toBeTruthy();
  });

  it('navigates to EventDetails when featured event is pressed', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    const eventCard = getByText('Music Festival 2025');
    fireEvent.press(eventCard);
    
    expect(mockNavigate).toHaveBeenCalledWith('EventDetails', { eventId: 1 });
  });

  it('displays statistics', () => {
    const { getByText } = renderWithNavigation(<HomeScreen />);
    
    expect(getByText('50+')).toBeTruthy();
    expect(getByText('Events')).toBeTruthy();
    expect(getByText('1K+')).toBeTruthy();
    expect(getByText('Users')).toBeTruthy();
    expect(getByText('5K+')).toBeTruthy();
    expect(getByText('Tickets Sold')).toBeTruthy();
  });
});
