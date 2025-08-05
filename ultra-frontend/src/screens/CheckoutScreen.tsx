import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CheckoutScreen({ route }) {
  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Mock data - would come from route.params
  const event = {
    title: 'Taylor Swift | The Eras Tour',
    venue: 'MetLife Stadium',
    date: 'Aug 15, 2025',
    time: '7:00 PM',
  };

  const selectedSeats = [
    { id: 'A5', section: 'Lower Bowl', row: 'A', seat: '5', price: 299 },
    { id: 'A6', section: 'Lower Bowl', row: 'A', seat: '6', price: 299 },
  ];

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = selectedSeats.length * 15.50;
  const processingFee = 4.95;
  const total = subtotal + serviceFee + processingFee;

  const handleCompleteOrder = () => {
    Alert.alert(
      'Order Confirmation',
      'Your tickets have been purchased successfully! Check your email for confirmation.',
      [
        { 
          text: 'View Tickets', 
          onPress: () => navigation.navigate('MyTickets') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetails}>{event.venue} • {event.date} • {event.time}</Text>
          </View>

          <View style={styles.ticketsList}>
            {selectedSeats.map(seat => (
              <View key={seat.id} style={styles.ticketItem}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketSection}>{seat.section}</Text>
                  <Text style={styles.ticketSeat}>Row {seat.row}, Seat {seat.seat}</Text>
                </View>
                <Text style={styles.ticketPrice}>${seat.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal ({selectedSeats.length} tickets)</Text>
              <Text style={styles.priceValue}>${subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Order Processing Fee</Text>
              <Text style={styles.priceValue}>${processingFee}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#0066CC' : '#666'} />
              <Text style={[styles.paymentText, paymentMethod === 'card' && styles.paymentTextSelected]}>
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'paypal' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Ionicons name="logo-paypal" size={24} color={paymentMethod === 'paypal' ? '#0066CC' : '#666'} />
              <Text style={[styles.paymentText, paymentMethod === 'paypal' && styles.paymentTextSelected]}>
                PayPal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'apple' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('apple')}
            >
              <Ionicons name="logo-apple" size={24} color={paymentMethod === 'apple' ? '#0066CC' : '#666'} />
              <Text style={[styles.paymentText, paymentMethod === 'apple' && styles.paymentTextSelected]}>
                Apple Pay
              </Text>
            </TouchableOpacity>
          </View>

          {paymentMethod === 'card' && (
            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.cardRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <View style={styles.termsContainer}>
            <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
            <Text style={styles.termsText}>
              Your purchase is protected by our secure checkout
            </Text>
          </View>
          
          <Text style={styles.disclaimer}>
            By completing your purchase, you agree to our Terms of Service and acknowledge our Privacy Policy. 
            Tickets are non-refundable except as required by law.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <View style={styles.ctaContent}>
          <View style={styles.ctaInfo}>
            <Text style={styles.ctaTotal}>${total.toFixed(2)}</Text>
            <Text style={styles.ctaSeats}>{selectedSeats.length} tickets</Text>
          </View>
          <TouchableOpacity style={styles.ctaButton} onPress={handleCompleteOrder}>
            <Ionicons name="lock-closed" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.ctaButtonText}>Complete Order</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  ticketsList: {
    marginBottom: 20,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSection: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ticketSeat: {
    fontSize: 14,
    color: '#666',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  paymentMethods: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  paymentOptionSelected: {
    borderColor: '#0066CC',
    backgroundColor: '#F0F7FF',
  },
  paymentText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#666',
  },
  paymentTextSelected: {
    color: '#0066CC',
    fontWeight: '600',
  },
  cardForm: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: 'row',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomCTA: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaInfo: {
    flex: 1,
  },
  ctaTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ctaSeats: {
    fontSize: 14,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
