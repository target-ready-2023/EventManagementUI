import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AlertSnackbar from '../Utility/AlertSnackbar';
// import axios from "axios";
import useEventData from "../Utility/Utility";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
} from "@mui/material";


export const AdminEvent = () => {
  const { instance, tableData, setTableData, loadEvents } = useEventData();

  const [formData, setFormData] = useState({
    title: "",
    eventType: "",
    startDate: "",
    endDate: "",
    lastRegistrationDate: "",
  });

  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setEditSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValAlert, setShowValAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastDateRegister, setLastDateRegister] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = tableData.slice(startIndex, endIndex);
  const [msg, setMsg] = useState('Please fill all fields');

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    await loadEvents();
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const theme = useTheme();

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      startDate: e.target.value,
    }));
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      endDate: e.target.value,
    }));
  };

  const handleLastRegisterDateChange = (e) => {
    setLastDateRegister(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      lastRegistrationDate: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      eventType: "",
      startDate: "",
      endDate: "",
      lastRegistrationDate: "",
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setEditingRecord(null);
    setOpen(false);
  };

  const handleUpdate = async () => {
    const index = tableData.findIndex(
      (record) => record.id === editingRecord.id
    );
    const updatedTableData = [...tableData];
    updatedTableData[index] = formData;
    updatedTableData[index].id = index + 1;
    const id = editingRecord.id;
    try {
      await instance.put(`/api/events/${id}`, updatedTableData[index]);
      loadEvents();
    } catch (error) {
      console.error("Error updating data:", error);
      setMsg(error.response.data.message)
      setShowErrorAlert(true);

    }

    setFormData({
      title: "",
      eventType: "",
      startDate: "",
      endDate: "",
      lastRegistrationDate: "",
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setEditingRecord("");
    setOpen(false); // Close the edit modal
    setEditSuccessAlert(true);
  };

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        title: editingRecord.title,
        eventType: editingRecord.eventType,
        startDate: editingRecord.startDate,
        endDate: editingRecord.endDate,
        lastRegistrationDate: editingRecord.lastRegistrationDate,
      });
      setStartDate(editingRecord.startDate);
      setEndDate(editingRecord.endDate);
      setLastDateRegister(editingRecord.lastRegistrationDate);
    }
  }, [editingRecord]);

  const handleSubmit = async () => {
    //  validation to ensure all fields are filled properly.
    if (
      formData.title &&
      formData.eventType &&
      formData.startDate &&
      formData.endDate &&
      formData.lastRegistrationDate
    ) {
      // console.log(formData);

      try {
        let exists, response;
        await instance
          .get(`/api/events`)
          .then((result) => {
            response = result;
            exists = result.data.data.some(
              (obj) => obj.title.toUpperCase() === formData.title.toUpperCase()
            );
          })
          .catch((error) => {
            console.log(error);
          });

        console.log(exists);
        console.log(formData.title);

        if (exists) {
          setShowValAlert(true);
        } else {
          setTableData(response.data.data);
          try {
            await instance.post(`/api/events`, formData).then(response=>{
              console.log(response)
              load();
              setFormData({
                title: "",
                eventType: "",
                startDate: "",
                endDate: "",
                lastRegistrationDate: "",
              });
              setStartDate("");
              setEndDate("");
              setLastDateRegister("");
              setOpen(false);
              setShowSuccessAlert(true);
            }).catch(err=>{
              if(err.response){
                const errorMessage = err.response.data.message;
                setMsg(errorMessage)
                setShowErrorAlert(true);
                
              }
              
              
            })
            console.log(formData)
            // load();
          } catch (error) {
            console.log(error);
          }

          
        }
      } catch (error) {
        console.error("Error Creating Event:", error);
        // Handle error here
      }
    } else {
      setShowErrorAlert(true);
    }
  };

  const editHandler = (record) => {
    setEditingRecord(record);
    setOpen(true);
  };

  const deleteHandler = async (id) => {
    try {
      await instance.delete(`/api/events/${id}`);
      await loadEvents();
      console.log(tableData);
    } catch (error) {
      console.error("Error Deleting Event:", error);
      // Handle error here
    }

    setShowDeleteAlert(true);
  };

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          style={{ backgroundColor: "#6c88c8", color: "white" }}
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
        >
          Add Event
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingRecord ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          {/* Create Event Form */}

          <TextField
            name="title"
            value={formData.title}
            onChange={handleChange}
            label="Event Name"
            required
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              name="eventType"
              value={formData.eventType}
              label="eventType"
              onChange={handleChange}
            >
              <MenuItem value="Sports day">Sports day</MenuItem>
              <MenuItem value="School day">School day</MenuItem>
              <MenuItem value="Talent day">Talent day</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            className="inputField"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: { xs: "12px", sm: "15px" } },
            }}
            InputProps={{
              sx: {
                fontSize: theme.breakpoints.down("sm") ? "12px" : "8px",
              },
            }}
          />

          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            className="inputField"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: { xs: "12px", sm: "15px" } },
            }}
            InputProps={{
              sx: {
                fontSize: theme.breakpoints.down("sm") ? "12px" : "8px",
              },
            }}
          />

          <TextField
            type="date"
            label="Last Date to Register"
            value={lastDateRegister}
            onChange={handleLastRegisterDateChange}
            className="inputField"
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: { xs: "12px", sm: "15px" } },
            }}
            InputProps={{
              sx: {
                fontSize: theme.breakpoints.down("sm") ? "12px" : "8px",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {editingRecord ? (
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        open={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        severity="success"
        message="Created Successfully"
      />

      <AlertSnackbar
        open={showEditSuccessAlert}
        onClose={() => setEditSuccessAlert(false)}
        severity="success"
        message="Updated Successfully"
      />

      <AlertSnackbar
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        severity="success"
        message="Deleted Successfully"
      />

      <AlertSnackbar
        open={showErrorAlert}
        onClose={() => {setShowErrorAlert(false)
          setMsg("Please fill all the fields")}}
        severity="error"
        message={msg}
      />

      <AlertSnackbar
        open={showValAlert}
        onClose={() => setShowValAlert(false)}
        severity="error"
        message="Record Exists try with other Event Name"
      />
      
      {/* Event Table */}
      {/* <TableList/> */}
      {tableData && tableData.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "360px", maxWidth: "99%", marginBottom: "30px" }}
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
                  Delete
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#6C88C8",
                    width: "50px",
                    color: "white",
                  }}
                >
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData?.map((row) => (
                <TableRow
                  key={row?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row?.id}</TableCell>
                  <TableCell sx={{ maxWidth: "300px" }}>{row.title}</TableCell>
                  <TableCell>{row?.eventType}</TableCell>
                  <TableCell>{row?.startDate}</TableCell>
                  <TableCell>{row?.endDate}</TableCell>
                  <TableCell>{row?.lastRegistrationDate}</TableCell>
                  <TableCell>
                    {" "}
                    <IconButton onClick={() => deleteHandler(row.id)}>
                      <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => editHandler(row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center" margin={"100px"}>
          No events
        </Typography>
      )}
      {tableData && tableData.length > 0 && (
        <Pagination
          count={Math.ceil(tableData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ marginBottom: "10px" }}
        />
      )}
    </Box>
  );
};

export default AdminEvent;
