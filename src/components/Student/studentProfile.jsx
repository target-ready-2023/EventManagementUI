import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Table, TableCell, TableHead,Box, Snackbar, Alert,TableContainer,TableRow, TableBody,Button,Paper,Pagination } from '@mui/material'

const StudentProfile = () => {
    const [tableData, setTableData] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = tableData.slice(startIndex, endIndex);


    useEffect(()=>{
        load_events()
    },[]);

    const load_events = async()=>{
    try{
    const registered_events  = await axios.get("http://localhost:8080/api/user/1/registered-events")
    console.log(registered_events)
    setTableData(registered_events.data.data)
    }
    catch(error){
        console.log(error, "Erorr in fetching registered events")
    }
    }
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };
    const handleDeregister = async(eventId)=>{
        try{
            const userId = 1;
            await axios.post(`http://localhost:8080/events/${eventId}/deregister/${userId}`)
            const registered_events = await axios.get("http://localhost:8080/api/user/1/registered-events");
            registered_events.data.data.sort((a, b) => a.id - b.id);
            setTableData(registered_events.data.data); 
            setShowSuccessAlert(true)
        }
        catch (error) {
            console.error("Error De-Registering Event:", error);
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
      <Alert onClose={() => setShowSuccessAlert(false)} severity="error">
        De-Registration Successful
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
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"50px" , color: "white"}}>Deregister</TableCell> 
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
                <TableCell>  <Button variant="outlined" style={{ color: 'red', borderColor: 'red' }} onClick={()=>{handleDeregister(row.id)}}> 
                    Deregister
                  </Button></TableCell>
                
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
  )
}

export default StudentProfile