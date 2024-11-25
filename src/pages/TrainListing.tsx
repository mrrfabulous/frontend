import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Train } from '../types';
import { Search, Train as TrainIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const MOCK_TRAINS: Train[] = Array.from({ length: 10 }, (_, i) => ({
  id: `train-${i + 1}`,
  name: `Express ${i + 1}`,
  from: ['New York', 'Boston', 'Chicago', 'Los Angeles'][Math.floor(Math.random() * 4)],
  to: ['Washington DC', 'Miami', 'Seattle', 'San Francisco'][Math.floor(Math.random() * 4)],
  departureTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  arrivalTime: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000).toISOString(),
  price: Math.floor(Math.random() * 200) + 50,
  availableSeats: Math.floor(Math.random() * 50) + 10,
}));

const TrainListing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    // Simulate API call
    const fetchTrains = async () => {
      try {
        setTimeout(() => {
          setTrains(MOCK_TRAINS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching trains:', error);
        toast.error('Failed to load trains');
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  const handleBooking = (e: React.MouseEvent<HTMLButtonElement>, trainId: string) => {
    e.preventDefault(); // Prevent default button behavior
    
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/booking/${trainId}`,
          trainId 
        } 
      });
    } else {
      navigate(`/booking/${trainId}`);
    }
  };

  const uniqueLocations = {
    from: Array.from(new Set(MOCK_TRAINS.map(train => train.from))),
    to: Array.from(new Set(MOCK_TRAINS.map(train => train.to))),
  };

  const filteredTrains = trains
    .filter(train => {
      const searchMatch = train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.to.toLowerCase().includes(searchTerm.toLowerCase());
      const fromMatch = !fromFilter || train.from === fromFilter;
      const toMatch = !toFilter || train.to === toFilter;
      return searchMatch && fromMatch && toMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'departure') return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      if (sortBy === 'seats') return b.availableSeats - a.availableSeats;
      return 0;
    });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Trains
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Trains"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>From</InputLabel>
              <Select
                value={fromFilter}
                label="From"
                onChange={(e) => setFromFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueLocations.from.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>To</InputLabel>
              <Select
                value={toFilter}
                label="To"
                onChange={(e) => setToFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueLocations.to.map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="departure">Departure Time</MenuItem>
                <MenuItem value="seats">Available Seats</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {filteredTrains.map((train) => (
            <Grid item xs={12} md={6} lg={4} key={train.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrainIcon size={24} style={{ marginRight: '8px' }} />
                    <Typography variant="h6" component="div">
                      {train.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    From: {train.from}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    To: {train.to}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Departure: {new Date(train.departureTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Arrival: {new Date(train.arrivalTime).toLocaleString()}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${train.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {train.availableSeats} seats available
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="large" 
                    fullWidth 
                    variant="contained"
                    onClick={(e) => handleBooking(e, train.id)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default TrainListing;
