import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Booking } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  tableCol: {
    flex: 1,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

interface InvoiceProps {
  booking: Booking;
}

export default function InvoiceGenerator({ booking }: InvoiceProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>TrainEase Invoice</Text>
          <View style={styles.invoiceInfo}>
            <View>
              <Text>Invoice #: INV-{booking.id}</Text>
              <Text>Date: {format(new Date(), 'PP')}</Text>
            </View>
            <View>
              <Text>TrainEase Limited</Text>
              <Text>123 Railway Street</Text>
              <Text>Lagos, Nigeria</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 10 }}>Bill To:</Text>
          <Text>{booking.passengerName}</Text>
          <Text>Ticket Number: {booking.ticketNumber}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Description</Text>
            <Text style={styles.tableCol}>Class</Text>
            <Text style={styles.tableCol}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>
              {booking.train.from} to {booking.train.to}
            </Text>
            <Text style={styles.tableCol}>
              {booking.seat.class.charAt(0).toUpperCase() + booking.seat.class.slice(1)}
            </Text>
            <Text style={styles.tableCol}>₦{booking.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text style={{ fontWeight: 'bold' }}>
            Total Amount: ₦{booking.totalAmount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for choosing TrainEase!</Text>
          <Text>For any queries, please contact support@trainease.com</Text>
        </View>
      </Page>
    </Document>
  );
}