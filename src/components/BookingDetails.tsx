import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface Seat {
  number: string;
  class: string;
  price: number;
}

interface Train {
  _id: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
}

interface Booking {
  _id: string;
  train: Train;
  seats: Seat[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  bookingDate: string;
}

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooking(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handleCancelBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooking(response.data.booking);
      setCancelDialogOpen(false);
    } catch (err: any) {
      setCancelError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Booking not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Booking Details</Typography>
                <Chip
                  label={booking.status}
                  color={booking.status === 'confirmed' ? 'success' : 'default'}
                  sx={{ mr: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Train
              </Typography>
              <Typography variant="body1">{booking.train.name}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Route
              </Typography>
              <Typography variant="body1">
                {booking.train.from} → {booking.train.to}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Departure
              </Typography>
              <Typography variant="body1">
                {new Date(booking.train.departureTime).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Arrival
              </Typography>
              <Typography variant="body1">
                {new Date(booking.train.arrivalTime).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Seats
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {booking.seats.map((seat) => (
                  <Chip
                    key={seat.number}
                    label={`${seat.number} (${seat.class})`}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Payment Status
              </Typography>
              <Chip
                label={booking.paymentStatus}
                color={booking.paymentStatus === 'completed' ? 'success' : 'default'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Total Amount
              </Typography>
              <Typography variant="h6">${booking.totalAmount}</Typography>
            </Grid>

            {booking.status !== 'cancelled' && (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={
                    booking.status === 'cancelled' ||
                    new Date(booking.train.departureTime).getTime() - new Date().getTime() <
                      2 * 60 * 60 * 1000
                  }
                >
                  Cancel Booking
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
          {cancelError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cancelError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Booking</Button>
          <Button onClick={handleCancelBooking} color="error">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingDetails;
