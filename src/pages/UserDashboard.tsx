import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  Train as TrainIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const recentBookings = [
    {
      id: 1,
      trainName: 'Express 123',
      date: '2024-02-15',
      from: 'New York',
      to: 'Boston',
      status: 'confirmed',
    },
    {
      id: 2,
      trainName: 'Local 456',
      date: '2024-02-20',
      from: 'Boston',
      to: 'Washington',
      status: 'pending',
    },
  ];

  const stats = [
    {
      title: 'Total Bookings',
      value: '5',
      icon: <TrainIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Upcoming Trips',
      value: '2',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Spent',
      value: '$450',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.firstName}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's an overview of your travel activities
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<TrainIcon />}
            onClick={() => navigate('/book-ticket')}
          >
            Book New Ticket
          </Button>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}15`,
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { color: stat.color },
                      })}
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Bookings
              </Typography>
              <List>
                {recentBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        py: 2,
                      }}
                    >
                      <ListItemIcon>
                        <TrainIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={booking.trainName}
                        secondary={`${booking.from} → ${booking.to}`}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'flex-start', sm: 'flex-end' },
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {booking.date}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button color="primary" onClick={() => navigate('/bookings')}>
                  View All Bookings
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Profile" />
                </ListItem>
                <ListItem button onClick={() => navigate('/book-ticket')}>
                  <ListItemIcon>
                    <TrainIcon />
                  </ListItemIcon>
                  <ListItemText primary="Book New Ticket" />
                </ListItem>
                <ListItem button onClick={() => navigate('/bookings')}>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Bookings" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
