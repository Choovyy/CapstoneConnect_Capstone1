import React from 'react';
import { Box, Grid, Typography, Button, Container } from '@mui/material';
import group from '../assets/group.jpg'; 

const UserSurveyPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#d4a95f1a', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Text Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                FIND YOUR <span style={{ color: '#5C55E7' }}>MATCH</span> HERE
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Connect with your ideal team!
              </Typography>
              <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 2, textTransform: 'none' }}>
                Match Now
              </Button>
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={group}
              alt="Team collaboration"
              sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
            />
          </Grid>
        </Grid>

        {/* Footer Branding */}
        <Box mt={6} display="flex" justifyContent="center">
          <Typography variant="subtitle1">
            <span style={{ fontWeight: 'bold', color: '#d29e52' }}>Capstone</span>
            <span style={{ fontWeight: 'bold', color: '#509ecf' }}>Connect</span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UserSurveyPage;
