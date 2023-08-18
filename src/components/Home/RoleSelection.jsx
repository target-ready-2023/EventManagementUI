import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate()
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleProceed = () => {
    if (selectedRole === null) {
      alert('Please select a role before proceeding.');
    } else {
      
      if (selectedRole === 'admin') {
        navigate('/admin')     } 
        else if (selectedRole === 'student') {
            navigate('/student')
      }
    }
  };
  const cardStyle = {
    height: '180px', 
     
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
      <Card style={cardStyle}>
          <CardContent>
            <Typography variant="h6">Admin</Typography>
            <Button variant="contained" sx={{margin:"20px",align:'center'}}
              onClick={() => handleRoleSelect('admin')}
            //   color={selectedRole === 'admin' ? 'primary' : 'default'}
            >
              Select Admin Role
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
      <Card style={cardStyle}>
          <CardContent>
            <Typography variant="h6">Student</Typography>
            <Button variant="contained" sx={{margin:"20px"}}
              onClick={() => handleRoleSelect('student')}
            //   color={selectedRole === 'student' ? 'primary' : 'default'}
            >
              Select Student Role
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} container justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleProceed} disabled={!selectedRole}>
          Proceed
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoleSelection;
