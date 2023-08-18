import React, { useEffect, useState } from "react";
import {
  Typography,
  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import AlertSnackbar from "../Utility/AlertSnackbar";
import useEventData from "../Utility/Utility";

const RegisterPage = (props) => {
  const value = props;
  // console.log(value)
  // const [tableData, setTableData] = useState([]);
  const [registeredData, setRegisteredData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeSuccessAlert, setShowDeSuccessAlert] = useState(false);
  const [showDeErrorAlert, setShowDeErrorAlert] = useState(false);
  const { instance, tableData, setTableData } = useEventData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = tableData.slice(startIndex, endIndex);
  

  useEffect(() => {
    loadEvents();
  }, []);

  // useEffect(() => {
  // }, [registeredData]);

  const loadEvents = async () => {
    try {
      const results = await instance.get(`/api/events`);
      results.data.data.sort((a, b) => a.id - b.id);

      const events = results.data.data;
      console.log(events);
      const currentDate = new Date();

      try {
        const userId = 38;
        const registered_events = await instance.get(
          `/api/registration/eventsForUser/${userId}`
        );
        setRegisteredData(registered_events.data.data);
      } catch (error) {
        console.log(error, "Erorr in fetching registered events");
      }

      if (props.state === "upcoming") {
        // const filteredData = await instance.get(
        //   `/api/events/upcomingEvents`
        // );
        /*events.filter((event) => {
          const lastRegistrationDate = new Date(
            event.lastRegistrationDate
          );
          return lastRegistrationDate >= currentDate;
        }); */
        // setTableData(filteredData); 
        await instance.get("/api/events/upcomingEvents")
        .then(response => {
          setTableData(response.data.data);
        })
        .catch(error => {
          console.log("Error", error);
        });
      } else {
        // const filteredData = events.filter((event) => {
        //   const lastRegistrationDate = new Date(
        //     event.lastRegistrationDate
        //   );
        //   return lastRegistrationDate < currentDate;
        // });
        // setTableData(filteredData);
        // console.log(filteredData);
        await instance.get("/api/events/pastEvents")
        .then(response => {
          setTableData(response.data.data);
          console.log(response.data.data);
        })
        .catch(error => {
          console.log("Error", error);
        }); 
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeregister = async (event) => {
    try {
      const userId = 38;
      await instance.post(`/api/registration/deregister`,{userId:userId,eventId:event.id});
     
      const updatedRegisteredData = registeredData.filter(
        (item) => item.id !== event.id
      );
      setRegisteredData(updatedRegisteredData);
      setShowDeSuccessAlert(true);
    } catch (error) {
      console.error("Error De-Registering Event:", error);
      setShowDeErrorAlert(true);
    }
  };
  const handleRegister = async (event) => {
    try {
      const userId = 38;
      await instance.post(`/api/registration/register`,{userId:userId,eventId:event.id});
      setRegisteredData([...registeredData, event]);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error Registering Event:", error);
      setShowErrorAlert(true);
    }
  };

  return (
    <Box>
      <AlertSnackbar
        open={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        severity="success"
        message="Registration Successful"
      />

      <AlertSnackbar
        open={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        severity="error"
        message="Registration was not Successful"
      />
     

      <AlertSnackbar
        open={showDeSuccessAlert}
        onClose={() => setShowDeSuccessAlert(false)}
        severity="success"
        message="De-Registration Successful"
      />
      
      <AlertSnackbar
        open={showDeErrorAlert}
        onClose={() => setShowDeErrorAlert(false)}
        severity="error"
        message="De-Registration was not Successful"
      />
{tableData && tableData.length > 0 ? (
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "360px",
          maxWidth: "98%",
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
              {value.state === "upcoming" && (
                <TableCell
                  sx={{
                    backgroundColor: "#6C88C8",
                    width: "50px",
                    color: "white",
                  }}
                >
                  Action
                </TableCell>
              )}
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
                {value.state === "upcoming" && (
                  <TableCell>
                    {console.log(row in registeredData, row, registeredData)}
                    {registeredData.some((item) => item.id === row.id) ? (
                      <Button
                        variant="outlined"
                        style={{ color: "red", borderColor: "red" }}
                        onClick={() => {
                          handleDeregister(row);
                        }}
                      >
                        Deregister
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ width: "125px" }}
                        onClick={() => {
                          handleRegister(row);
                        }}
                      >
                        Register
                      </Button>
                    )}
                  </TableCell>
                 )} 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>)
      : (
        <Typography variant="body1" align="center" >
          No events
        </Typography>
      )}
      <Pagination
        count={Math.ceil(tableData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginBottom: "40px" }}
      />
    </Box>
  );
};

export default RegisterPage;
