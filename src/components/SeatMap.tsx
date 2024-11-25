import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import { Seat } from '../types';

interface SeatMapProps {
  onSeatSelect: (seats: Seat[]) => void;
}

const ROWS = 10;
const SEATS_PER_ROW = 6;

const SeatMap: React.FC<SeatMapProps> = ({ onSeatSelect }) => {
  const theme = useTheme();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Generate mock seat data
  const generateSeats = () => {
    const seats: Seat[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let seatNum = 0; seatNum < SEATS_PER_ROW; seatNum++) {
        const seatId = `${String.fromCharCode(65 + row)}${seatNum + 1}`;
        seats.push({
          id: seatId,
          number: seatId,
          status: Math.random() > 0.3 ? 'available' : 'booked',
          class: seatNum < 3 ? 'first' : 'economy',
        });
      }
    }
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.some((s) => s.id === seat.id);
      let newSelected;

      if (isSelected) {
        newSelected = prevSelected.filter((s) => s.id !== seat.id);
      } else {
        newSelected = [...prevSelected, seat];
      }

      // Call the parent's onSeatSelect with the updated selection
      onSeatSelect(newSelected);
      return newSelected;
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'booked') {
      return theme.palette.grey[300];
    }
    if (selectedSeats.some((s) => s.id === seat.id)) {
      return theme.palette.primary.main;
    }
    return seat.class === 'first' 
      ? theme.palette.secondary.light 
      : theme.palette.success.light;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        backgroundColor: theme.palette.background.default 
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Seat Legend
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.palette.secondary.light,
                  borderRadius: 1,
                }}
              />
              <Typography>First Class</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.palette.success.light,
                  borderRadius: 1,
                }}
              />
              <Typography>Economy</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 1,
                }}
              />
              <Typography>Booked</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1,
                }}
              />
              <Typography>Selected</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={2} justifyContent="center">
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Grid container spacing={1} justifyContent="center">
                {seats
                  .slice(rowIndex * SEATS_PER_ROW, (rowIndex + 1) * SEATS_PER_ROW)
                  .map((seat) => (
                    <Grid item key={seat.id}>
                      <Button
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          backgroundColor: getSeatColor(seat),
                          color: theme.palette.getContrastText(
                            getSeatColor(seat)
                          ),
                          '&:hover': {
                            backgroundColor: seat.status !== 'booked'
                              ? theme.palette.primary.dark
                              : theme.palette.grey[300],
                          },
                        }}
                      >
                        {seat.number}
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default SeatMap;