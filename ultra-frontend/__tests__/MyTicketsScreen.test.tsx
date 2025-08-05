import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MyTicketsScreen from '../src/screens/MyTicketsScreen';

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('MyTicketsScreen', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithNavigation(<MyTicketsScreen />);
    
    expect(getByText('My Tickets')).toBeTruthy();
    expect(getByText('Your purchased tickets')).toBeTruthy();
  });

  it('displays tickets when available', () => {
    const { getByText } = renderWithNavigation(<MyTicketsScreen />);
    
    expect(getByText('Summer Music Festival')).toBeTruthy();
    expect(getByText('Tech Conference 2025')).toBeTruthy();
  });

  it('displays ticket details correctly', () => {
    const { getByText } = renderWithNavigation(<MyTicketsScreen />);
    
    // Check dates
    expect(getByText('August 15, 2025')).toBeTruthy();
    expect(getByText('September 10, 2025')).toBeTruthy();
    
    // Check ticket types
    expect(getByText('VIP')).toBeTruthy();
    expect(getByText('General')).toBeTruthy();
    
    // Check quantity
    expect(getByText('2 tickets')).toBeTruthy();
    expect(getByText('1 ticket')).toBeTruthy();
    
    // Check status
    expect(getByText('CONFIRMED')).toBeTruthy();
    expect(getByText('PENDING')).toBeTruthy();
  });

  it('displays View Ticket buttons', () => {
    const { getAllByText } = renderWithNavigation(<MyTicketsScreen />);
    
    const viewButtons = getAllByText('View Ticket');
    expect(viewButtons).toHaveLength(2);
  });
});
