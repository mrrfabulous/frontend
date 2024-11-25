import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Train as TrainIcon,
  Payment as PaymentIcon,
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5">Access Denied</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You need administrator privileges to view this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: '247',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Active Bookings',
      value: '42',
      icon: <TrainIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Revenue',
      value: '$15,890',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'System Admins',
      value: '3',
      icon: <AdminIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Welcome back, {user.firstName}!
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrainIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="New Booking"
                    secondary="John Doe booked a ticket to London"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="New User"
                    secondary="Sarah Smith created an account"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PaymentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Received"
                    secondary="$150 received for booking #12345"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrainIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Booking System"
                    secondary="Operating normally"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PaymentIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Gateway"
                    secondary="Connected and processing"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AdminIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Admin Panel"
                    secondary="All services running"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}