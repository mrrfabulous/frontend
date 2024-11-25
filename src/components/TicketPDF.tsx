import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Booking } from '../types';

// Register custom font
Font.register({
  family: 'Inter',
  src: 'https://rsms.me/inter/font-files/Inter-Regular.woff2',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#666',
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 15,
  },
});

interface TicketPDFProps {
  booking: Booking;
  qrCodeUrl: string;
}

export default function TicketPDF({ booking, qrCodeUrl }: TicketPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>TrainEase</Text>
          <Text style={{ color: '#666' }}>E-Ticket</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.title}>Booking Confirmation</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ticket Number</Text>
            <Text style={styles.value}>{booking.ticketNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Passenger Name</Text>
            <Text style={styles.value}>{booking.passengerName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Journey Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Train</Text>
            <Text style={styles.value}>{booking.train.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{booking.train.from}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{booking.train.to}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Departure</Text>
            <Text style={styles.value}>
              {format(new Date(booking.train.departureTime), 'PPP p')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Arrival</Text>
            <Text style={styles.value}>
              {format(new Date(booking.train.arrivalTime), 'PPP p')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Seat Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Seat Number</Text>
            <Text style={styles.value}>{booking.seat.number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Class</Text>
            <Text style={styles.value}>
              {booking.seat.class.charAt(0).toUpperCase() + booking.seat.class.slice(1)}
            </Text>
          </View>
        </View>

        <Image src={qrCodeUrl} style={styles.qrCode} />

        <View style={styles.footer}>
          <Text>This is an electronically generated ticket and requires no signature.</Text>
          <Text style={{ marginTop: 5 }}>
            Please present this ticket along with a valid ID during the journey.
          </Text>
        </View>
      </Page>
    </Document>
  );
}