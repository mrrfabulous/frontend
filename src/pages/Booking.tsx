import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Train, Seat } from '../types';
import { CreditCard } from 'lucide-react';
import SeatMap from '../components/SeatMap';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';
import { Box, Typography, Button, CircularProgress, Container, Paper } from '@mui/material';

// Mock data for demonstration
const MOCK_TRAIN: Train = {
  id: '1',
  name: 'Express 101',
  from: 'New York',
  to: 'Boston',
  departureTime: '2024-03-20T08:00:00',
  arrivalTime: '2024-03-20T12:00:00',
  price: 89.99,
  availableSeats: 45
};

const Booking: React.FC = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [train, setTrain] = useState<Train | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !user) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            trainId: trainId 
          } 
        });
        return;
      }

      // Simulate API call to fetch train details
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        setTimeout(() => {
          setTrain(MOCK_TRAIN);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching train details:', error);
        toast.error('Failed to load train details');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [trainId, user, isAuthenticated, navigate]);

  const handleSeatSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const handleProceedToPayment = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (paymentDetails: any) => {
    try {
      // TODO: Implement actual payment processing
      console.log('Processing payment:', paymentDetails);
      toast.success('Booking successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!train) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          Train not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box component="div" sx={{ p: 3, my: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book Your Journey
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="h5">{train.name}</Typography>
          <Typography variant="subtitle1">
            {train.from} → {train.to}
          </Typography>
          <Typography variant="body1">
            Departure: {new Date(train.departureTime).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            Arrival: {new Date(train.arrivalTime).toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Price: ${train.price}
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Your Seats
          </Typography>
          <SeatMap onSeatSelect={handleSeatSelect} />
        </Box>

        <Box 
          component="div" 
          sx={{ 
            mt: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Typography variant="h6">
            Selected Seats: {selectedSeats.length}
          </Typography>
          <Typography variant="h6">
            Total: ${(selectedSeats.length * train.price).toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreditCard />}
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>

      {isPaymentModalOpen && selectedSeats.length > 0 && (
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
          amount={selectedSeats.length * train.price}
          seats={selectedSeats}
        />
      )}
    </Container>
  );
};

export default Booking;