import React, { useEffect, useState } from 'react';
import {  Pagination,Table, TableHead, TableRow, TableCell, TableContainer, Box, TableBody, Paper,Button,Snackbar,Alert } from '@mui/material';
import axios from "axios";


const RegisterPage = (props) => {
  const value = props
  // console.log(value)
  const [tableData, setTableData] = useState([]);
  const [registeredData, setRegisteredData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeSuccessAlert, setShowDeSuccessAlert] = useState(false);
  const [showDeErrorAlert, setShowDeErrorAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = tableData.slice(startIndex, endIndex);
  

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    console.log("set", registeredData);
}, [registeredData]);

  const loadEvents = async () => {
    try {
      const results = await axios.get("http://localhost:8080/api/events");
      console.log(results);
      results.data.data.sort((a, b) => a.id - b.id);
    
      const events = results.data.data;
      const currentDate = new Date();
      try{
        const registered_events  = await axios.get("http://localhost:8080/api/user/1/registered-events")
        // console.log("registered events",registered_events.data.data)
        setRegisteredData(registered_events.data.data)
        }
        catch(error){
            console.log(error, "Erorr in fetching registered events")
        }
        
      
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

      const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
      };

      const handleDeregister = async(event)=>{
         try{
            const userId = 1;
            await axios.post(`http://localhost:8080/events/${event.id}/deregister/${userId}`)
            const registered_events = await axios.get("http://localhost:8080/api/user/1/registered-events");
            registered_events.data.data.sort((a, b) => a.id - b.id);
            setRegisteredData(registeredData.filter(item => item !== event));
            setShowDeSuccessAlert(true)
        }
        catch (error) {
            console.error("Error De-Registering Event:", error);
            setShowDeErrorAlert(true)
        }

      }
      const handleRegister= async(event)=>{
        try{
          const userId =1;
        await axios.post(`http://localhost:8080/events/${event.id}/register/${userId}`)
        setRegisteredData([...registeredData,event])
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
        Registration was not Successful
      </Alert>
      </Snackbar>


      <Snackbar
        open={showDeSuccessAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowDeSuccessAlert(false)}
      >
      <Alert onClose={() => setShowDeSuccessAlert(false)} severity="error">
        De-Registration Successful
      </Alert>
      </Snackbar>
      <Snackbar
        open={showDeErrorAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowDeErrorAlert(false)}
      >
      <Alert onClose={() => setShowDeErrorAlert(false)} severity="error">
        Registration was not Successful
      </Alert>
      </Snackbar>
      

      <TableContainer component={Paper} sx={{ maxHeight: "360px", maxWidth: "98%", marginLeft:"20px",marginBottom:"20px" }}>
        <Table aria-label="simple table" stickyHeader>
        <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"60px", color: "white" }}>Event Id </TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"400px", color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"200px" , color: "white"}}>Event Type</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>Start Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>End Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"150px", color: "white" }}>Last Date to Register</TableCell>
              {value.state==='upcoming' && (<TableCell sx={{ backgroundColor: "#6C88C8", width:"50px" , color: "white"}}>Action</TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ maxWidth: "300px" }}>{row.title}</TableCell>
                <TableCell>{row.eventType}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.lastDateForRegistration}</TableCell>               
                    {value.state === 'upcoming' && (
                    <TableCell>
                      {console.log(row in registeredData,row, registeredData)}
                      {registeredData.some(item => item.id === row.id) ? (
                        <Button variant="outlined" style={{ color: 'red', borderColor: 'red' }} onClick={() => { handleDeregister(row) }}>
                          Deregister
                        </Button>
                      ) : (
                        <Button variant="outlined" color="primary" style={{ width:'125px' }} onClick={() => { handleRegister(row) }}>
                          Register
                        </Button>
                      )}
                    </TableCell>
                    )}
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      
      </TableContainer>
      <Pagination
        count={Math.ceil(tableData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}sx={{marginBottom:"40px"}}
      />
    </Box>
  );
};

export default RegisterPage;
