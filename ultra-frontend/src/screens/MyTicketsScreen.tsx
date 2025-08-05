import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MyTicketsScreen() {
  // Mock tickets - like Ticketmaster's My Account
  const upcomingTickets = [
    {
      id: 1,
      eventTitle: 'Taylor Swift | The Eras Tour',
      venue: 'MetLife Stadium',
      date: 'Aug 15, 2025',
      time: '7:00 PM',
      section: 'Floor A',
      row: '12',
      seats: '15-16',
      quantity: 2,
      orderNumber: 'TM12345678',
    },
    {
      id: 2,
      eventTitle: 'Yankees vs Red Sox',
      venue: 'Yankee Stadium',
      date: 'Aug 20, 2025',
      time: '1:05 PM',
      section: 'Section 203',
      row: '8',
      seats: '5-6',
      quantity: 2,
      orderNumber: 'TM87654321',
    },
  ];

  const pastTickets = [
    {
      id: 3,
      eventTitle: 'Hamilton',
      venue: 'Richard Rodgers Theatre',
      date: 'Jul 25, 2025',
      time: '8:00 PM',
      section: 'Orchestra',
      row: 'K',
      seats: '101-102',
      quantity: 2,
      orderNumber: 'TM11223344',
    },
  ];

  const renderTicket = (ticket, isPast = false) => (
    <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
          <Text style={styles.venue}>{ticket.venue}</Text>
          <Text style={styles.dateTime}>{ticket.date} • {ticket.time}</Text>
        </View>
        <View style={styles.ticketActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code" size={24} color="#0066CC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.seatInfo}>
        <View style={styles.seatDetail}>
          <Text style={styles.seatLabel}>Section</Text>
          <Text style={styles.seatValue}>{ticket.section}</Text>
        </View>
        <View style={styles.seatDetail}>
          <Text style={styles.seatLabel}>Row</Text>
          <Text style={styles.seatValue}>{ticket.row}</Text>
        </View>
        <View style={styles.seatDetail}>
          <Text style={styles.seatLabel}>Seats</Text>
          <Text style={styles.seatValue}>{ticket.seats}</Text>
        </View>
        <View style={styles.seatDetail}>
          <Text style={styles.seatLabel}>Qty</Text>
          <Text style={styles.seatValue}>{ticket.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.ticketFooter}>
        <Text style={styles.orderNumber}>Order #{ticket.orderNumber}</Text>
        {!isPast && (
          <TouchableOpacity style={styles.viewTicketsButton}>
            <Text style={styles.viewTicketsText}>View Tickets</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tickets</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {upcomingTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcomingTickets.map(ticket => renderTicket(ticket))}
          </View>
        )}

        {pastTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Events</Text>
            {pastTickets.map(ticket => renderTicket(ticket, true))}
          </View>
        )}

        {upcomingTickets.length === 0 && pastTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={80} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptySubtitle}>
              When you buy tickets, they'll appear here
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  ticketInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  venue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  ticketActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  seatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  seatDetail: {
    alignItems: 'center',
  },
  seatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  seatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 12,
    color: '#999',
  },
  viewTicketsButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewTicketsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MyTicketsScreen() {
  const tickets = [
    {
      id: 1,
      eventTitle: 'Summer Music Festival',
      date: 'August 15, 2025',
      ticketType: 'VIP',
      quantity: 2,
      status: 'confirmed',
    },
    {
      id: 2,
      eventTitle: 'Tech Conference 2025',
      date: 'September 10, 2025',
      ticketType: 'General',
      quantity: 1,
      status: 'pending',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#27AE60';
      case 'pending':
        return '#F39C12';
      case 'cancelled':
        return '#E74C3C';
      default:
        return '#7F8C8D';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <Text style={styles.subtitle}>Your purchased tickets</Text>
      </View>

      <ScrollView style={styles.content}>
        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptySubtitle}>
              Browse events to purchase your first ticket
            </Text>
          </View>
        ) : (
          tickets.map((ticket) => (
            <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(ticket.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {ticket.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.ticketDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{ticket.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="pricetag-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{ticket.ticketType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Ticket</Text>
                <Ionicons name="chevron-forward" size={16} color="#007AFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  ticketCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ticketDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            My Tickets
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Your tickets with animated QR codes, transfer functionality, and offline access!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
