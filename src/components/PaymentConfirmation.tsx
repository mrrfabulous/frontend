import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface PaymentConfirmationProps {
  onSuccess?: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ onSuccess }) => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/bookings/verify-payment/${reference}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.booking) {
          if (onSuccess) {
            onSuccess();
          }
          // Redirect to booking details page after 3 seconds
          setTimeout(() => {
            navigate(`/bookings/${response.data.booking._id}`);
          }, 3000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    if (reference) {
      verifyPayment();
    }
  }, [reference, navigate, onSuccess]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5">Verifying Payment...</Typography>
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              Please wait while we confirm your payment
            </Typography>
          </>
        ) : error ? (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              Payment verified successfully!
            </Alert>
            <Typography variant="body1">
              Redirecting to your booking details...
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default PaymentConfirmation;
