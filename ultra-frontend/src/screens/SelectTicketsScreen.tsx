import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function SelectTicketsScreen({ route }) {
  const navigation = useNavigation();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Mock event data - would come from route.params
  const event = {
    id: 1,
    title: 'Taylor Swift | The Eras Tour',
    venue: 'MetLife Stadium',
    date: 'Aug 15, 2025',
    time: '7:00 PM',
  };

  // Mock seating sections
  const sections = [
    {
      id: 1,
      name: 'Floor A',
      price: 599,
      color: '#FF6B6B',
      available: 45,
      total: 100,
    },
    {
      id: 2,
      name: 'Lower Bowl',
      price: 299,
      color: '#4ECDC4',
      available: 156,
      total: 200,
    },
    {
      id: 3,
      name: 'Club Level',
      price: 199,
      color: '#45B7D1',
      available: 89,
      total: 150,
    },
    {
      id: 4,
      name: 'Upper Bowl',
      price: 89,
      color: '#96CEB4',
      available: 234,
      total: 300,
    },
  ];

  // Mock seat map - simplified grid
  const generateSeatMap = () => {
    const seatMap = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    rows.forEach((row, rowIndex) => {
      const seats = [];
      for (let seatNum = 1; seatNum <= 12; seatNum++) {
        const seatId = `${row}${seatNum}`;
        const isAvailable = Math.random() > 0.3; // 70% availability
        const isSelected = selectedSeats.includes(seatId);
        
        seats.push({
          id: seatId,
          row,
          number: seatNum,
          available: isAvailable,
          selected: isSelected,
          price: 299, // Default price
        });
      }
      seatMap.push({ row, seats });
    });
    
    return seatMap;
  };

  const seatMap = generateSeatMap();

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else if (prev.length < 8) { // Max 8 tickets
        return [...prev, seatId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigation.navigate('Checkout', { 
        event, 
        selectedSeats: selectedSeats.map(seatId => ({
          id: seatId,
          price: 299,
          section: 'Lower Bowl',
        }))
      });
    }
  };

  const totalPrice = selectedSeats.length * 299;
  const serviceFee = selectedSeats.length * 15.50;
  const finalTotal = totalPrice + serviceFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <Text style={styles.headerSubtitle}>{event.title}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Price Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Price</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sections.map(section => (
              <TouchableOpacity key={section.id} style={styles.priceFilter}>
                <View style={[styles.priceColor, { backgroundColor: section.color }]} />
                <Text style={styles.priceName}>{section.name}</Text>
                <Text style={styles.priceAmount}>${section.price}</Text>
                <Text style={styles.priceAvailable}>{section.available} left</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Interactive Seat Map */}
        <View style={styles.seatMapSection}>
          <Text style={styles.sectionTitle}>Interactive Seat Map</Text>
          
          {/* Stage */}
          <View style={styles.stage}>
            <Text style={styles.stageText}>STAGE</Text>
          </View>

          {/* Seat Grid */}
          <View style={styles.seatGrid}>
            {seatMap.map(({ row, seats }) => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLabel}>{row}</Text>
                <View style={styles.seatRowContainer}>
                  {seats.map(seat => (
                    <TouchableOpacity
                      key={seat.id}
                      style={[
                        styles.seat,
                        !seat.available && styles.seatUnavailable,
                        seat.selected && styles.seatSelected,
                      ]}
                      onPress={() => seat.available && handleSeatSelect(seat.id)}
                      disabled={!seat.available}
                    >
                      <Text style={[
                        styles.seatText,
                        !seat.available && styles.seatTextUnavailable,
                        seat.selected && styles.seatTextSelected,
                      ]}>
                        {seat.number}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.seat]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.seatSelected]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.seatUnavailable]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </View>

        {/* Best Available */}
        <View style={styles.bestAvailable}>
          <TouchableOpacity style={styles.bestAvailableButton}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.bestAvailableText}>Find Best Available</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Bottom Summary */}
      {selectedSeats.length > 0 && (
        <View style={styles.bottomSummary}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summarySeats}>
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
              </Text>
              <Text style={styles.summaryPrice}>Total: ${finalTotal.toFixed(2)}</Text>
              <Text style={styles.summaryBreakdown}>
                Tickets: ${totalPrice} + Fees: ${serviceFee.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Instructions */}
      {selectedSeats.length === 0 && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            Tap seats to select • Maximum 8 tickets per order
          </Text>
        </View>
      )}
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
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceFilter: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  priceColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  priceName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 2,
  },
  priceAvailable: {
    fontSize: 10,
    color: '#666',
  },
  seatMapSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stage: {
    backgroundColor: '#333',
    paddingVertical: 10,
    marginBottom: 30,
    borderRadius: 20,
  },
  stageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seatGrid: {
    alignItems: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  seatRowContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  seat: {
    width: 20,
    height: 20,
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 4,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatSelected: {
    backgroundColor: '#0066CC',
  },
  seatUnavailable: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCCCCC',
  },
  seatText: {
    fontSize: 8,
    color: '#0066CC',
    fontWeight: '600',
  },
  seatTextSelected: {
    color: 'white',
  },
  seatTextUnavailable: {
    color: '#CCCCCC',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendSeat: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  bestAvailable: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  bestAvailableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  bestAvailableText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
  },
  bottomSummary: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summarySeats: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
    marginTop: 2,
  },
  summaryBreakdown: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: 'white',
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
