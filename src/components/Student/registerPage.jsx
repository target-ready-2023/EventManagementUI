import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableContainer, Box, TableBody, Paper,Button,Snackbar,Alert } from '@mui/material';
import axios from "axios";
import { useParams } from "react-router-dom";

const RegisterPage = (props) => {
  const value = props
  // console.log(value)
  const [tableData, setTableData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  // const {eventId,userId}= useParams();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const results = await axios.get("http://localhost:8080/api/events");
      console.log(results);
      results.data.data.sort((a, b) => a.id - b.id);
    
      const events = results.data.data;
      const currentDate = new Date();

      
      if(props.state==='upcoming'){
          // console.log(props)
          const filteredData = events.filter(event => {
          const lastDateForRegistration = new Date(event.lastDateForRegistration);
          return lastDateForRegistration >= currentDate;
        });
        setTableData(filteredData)
      }
      else{
        // console.log(props)
        const filteredData = events.filter(event => {
          const lastDateForRegistration = new Date(event.lastDateForRegistration);
          return lastDateForRegistration < currentDate;
        });
        setTableData(filteredData)
      }

    
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };


      const handleRegister= async(eventId)=>{
        try{
          const userId =1;
        await axios.post(`http://localhost:8080/events/${eventId}/register/${userId}`)
        setShowSuccessAlert(true)
        }
        catch (error) {
          console.error("Error Registering Event:", error);
          setShowErrorAlert(true)
        }
      }

      

  return (
    
    <Box>
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowSuccessAlert(false)}
      >
      <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
        Registration Successful
      </Alert>
      </Snackbar>
      <Snackbar
        open={showErrorAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowErrorAlert(false)}
      >
      <Alert onClose={() => setShowErrorAlert(false)} severity="error">
        Registration Successful
      </Alert>
      </Snackbar>



      <TableContainer component={Paper} sx={{ maxHeight: "400px", maxWidth: "99%", marginLeft:"20px",marginBottom:"20px" }}>
        <Table aria-label="simple table" stickyHeader>
        <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"60px", color: "white" }}>Event Id </TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"400px", color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"200px" , color: "white"}}>Event Type</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>Start Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>End Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"150px", color: "white" }}>Last Date to Register</TableCell>
              {value.state==='upcoming' && (<TableCell sx={{ backgroundColor: "#6C88C8", width:"50px" , color: "white"}}>Register</TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ maxWidth: "300px" }}>{row.title}</TableCell>
                <TableCell>{row.eventType}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.lastDateForRegistration}</TableCell>               
                {value.state==='upcoming' && (<TableCell>  <Button variant="outlined" color="primary" onClick={()=>{handleRegister(row.id)}}> 
                    Register
                  </Button></TableCell>)}
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      
      </TableContainer>
    </Box>
  );
};

export default RegisterPage;
