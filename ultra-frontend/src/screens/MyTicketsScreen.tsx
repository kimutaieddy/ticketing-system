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

export const MyTicketsScreen: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated } = useUserStore();

  // 🔐 Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return <TicketsLoginPrompt />;
  }

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
