import React, { useEffect, useState } from "react";
// import axios from 'axios'
import {
  Table,
  TableCell,
  TableHead,
  Box,
  TableContainer,
  TableRow,
  TableBody,
  Button,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";
import AlertSnackbar from "../Utility/AlertSnackbar";
import useEventData from "../Utility/Utility";
const StudentProfile = () => {
  // const [tableData, setTableData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { instance, tableData, setTableData } = useEventData();
  const displayedData = tableData.slice(startIndex, endIndex);

  useEffect(() => {
    load_events();
  }, []);

  const load_events = async () => {
    const userId = 38;
    // try{
    await instance
      .get(`/api/registration/eventsForUser/${userId}`)
      .then((registered_events) => {
        console.log(registered_events);
        setTableData(registered_events.data.data);
      })
      .catch((error) => {
        console.log(error, "Erorr in fetching registered events");
      });

    // }
    // catch(error){
    //     console.log(error, "Erorr in fetching registered events")
    // }
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    // load_events()
  }, [tableData]);
  const handleDeregister = async (eventId) => {
    try {
      const userId = 38;
      // console.log(eventId.data.data[0].id);
      await instance.post(`/api/registration/deregister`,{userId:userId,eventId:eventId});
    
      await load_events();
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error De-Registering Event:", error);
      setShowErrorAlert(true);
    }
  };
  return (
    <Box>
      <AlertSnackbar
        open={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        severity="success"
        message="De-Registration Successful"
      />

      <AlertSnackbar
        open={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        severity="error"
        message="De-Registration was not Successful"
      />

      
{tableData && tableData.length > 0 ? (
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "400px",
          maxWidth: "99%",
          marginLeft: "20px",
          marginBottom: "20px",
        }}
      >
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "60px",
                  color: "white",
                }}
              >
                Event Id{" "}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "400px",
                  color: "white",
                }}
              >
                Event Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "200px",
                  color: "white",
                }}
              >
                Event Type
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "100px",
                  color: "white",
                }}
              >
                Start Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "100px",
                  color: "white",
                }}
              >
                End Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "150px",
                  color: "white",
                }}
              >
                Last Date to Register
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#6C88C8",
                  width: "50px",
                  color: "white",
                }}
              >
                Deregister
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ maxWidth: "300px" }}>{row.title}</TableCell>
                <TableCell>{row.eventType}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.lastRegistrationDate}</TableCell>
                <TableCell>
                  {" "}
                  <Button
                    variant="outlined"
                    style={{ color: "red", borderColor: "red" }}
                    onClick={() => {
                      handleDeregister(row);
                    }}
                  >
                    Deregister
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>):<Typography>No Registered Events</Typography>}
      {tableData && (
      <Pagination
        count={Math.ceil(tableData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginBottom: "40px" }}
      />)}
    </Box>
  );
};

export default StudentProfile;
