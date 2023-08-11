import React, { useState,useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import {
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
  Alert,
  Snackbar,
  useTheme
} from "@mui/material";
import { useParams } from "react-router-dom";





export const Admin_Event = () => {
  const [formData, setFormData] = useState({
    title: "",
    eventType: "",
    startDate: "",
    endDate: "",
    lastDateForRegistration: "",
  });
 
  
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setEditSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValAlert, setShowValAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
  const [lastDateRegister,setLastDateRegister] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {id}= useParams();
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = tableData.slice(startIndex, endIndex);
  
  useEffect(()=>{
    loadEvents();
  },[]);
  const loadEvents = async()=>{
    const results = await axios.get("http://localhost:8080/api/events");
    console.log(results);
    results.data.data.sort((a, b) => a.id - b.id);
    setTableData(results.data.data);
  }
  
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
      lastDateForRegistration: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  const handleCancel=()=>{
    setFormData({
      title: "",
      eventType: "",
      startDate: "",
      endDate: "",
      lastDateForRegistration: ""
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setEditingRecord(null);
    setOpen(false);

  }

  const handleUpdate = async() => {
    const index = tableData.findIndex((record) => record.id === editingRecord.id);
    const updatedTableData = [...tableData];
    updatedTableData[index] = formData;
    updatedTableData[index].id = index + 1;
    const id = editingRecord.id;
    try {
    await axios.put(`http://localhost:8080/api/events/${id}`, updatedTableData[index]);
    const response = await axios.get("http://localhost:8080/api/events");
    response.data.data.sort((a, b) => a.id - b.id);
    setTableData(response.data.data); // Assuming your API returns an array of data

    // ...rest of your code
  } catch (error) {
    console.error("Error updating data:", error);
    // Handle error here
  }
    setFormData({
      title: "",
      eventType: "",
      startDate: "",
      endDate: "",
      lastDateForRegistration: ""
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setEditingRecord("");
    setOpen(false); // Close the edit modal
    setEditSuccessAlert(true);

  }


  useEffect(() => {
    if (editingRecord) {
      setFormData({
        title: editingRecord.title,
        eventType: editingRecord.eventType,
        startDate: editingRecord.startDate,
        endDate: editingRecord.endDate,
        lastDateForRegistration: editingRecord.lastDateForRegistration,
      });
      setStartDate(editingRecord.startDate);
      setEndDate(editingRecord.endDate);
      setLastDateRegister(editingRecord.lastDateForRegistration);
    }
  }, [editingRecord]);

  

  const handleSubmit = async() => {
    //  validation to ensure all fields are filled properly.
    if(formData.title && formData.eventType && formData.startDate && formData.endDate && formData.lastDateForRegistration){
      console.log(formData)
     
      try {
       
        const response = await axios.get("http://localhost:8080/api/events");
        const exists = response.data.data.some(obj => obj.title.toUpperCase() === formData.title.toUpperCase());
        console.log(exists);
        console.log(formData.title);

        if(exists){
          setShowValAlert(true);
        }
       else{
        setTableData(response.data.data);
        await axios.post("http://localhost:8080/api/events",formData)
        const updatedResponse = await axios.get("http://localhost:8080/api/events");

        // Update the state with the new event list
        setTableData(updatedResponse.data.data);

        setFormData({
          title: "",
          eventType: "",
          startDate: "",
          endDate: "",
          lastDateForRegistration: ""
        });
        setStartDate("");
        setEndDate("");
        setLastDateRegister("");
        setOpen(false);
        setShowSuccessAlert(true);
       }
    
       
      } catch (error) {
        console.error("Error Creating Event:", error);
        // Handle error here
      }
      
   
    
    }
    else{
      setShowErrorAlert(true);
    }
    

  };

  const editHandler = (record)=>{
    setEditingRecord(record);
    setOpen(true);
  }

  const deleteHandler= async(id)=>{
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`)
      const response = await axios.get("http://localhost:8080/api/events");
      response.data.data.sort((a, b) => a.id - b.id);
      setTableData(response.data.data); 
  
      
    } catch (error) {
      console.error("Error Deleting Event:", error);
      // Handle error here
    }
   
   
    setShowDeleteAlert(true);
    
  }


  
  return (
    <Box>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom:"20px" }}>
      <Button variant="contained" style={{ backgroundColor: "#6c88c8", color: "white" }} onClick={() => setOpen(true)} startIcon= {<AddIcon/>}>
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
          <TextField
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            label="Event Type"
            required
            fullWidth
            margin="normal"

          />
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


      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowSuccessAlert(false)}
      >
      <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
        Created Successfully
      </Alert>
      </Snackbar>
      
      <Snackbar
        open={showEditSuccessAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setEditSuccessAlert(false)}
      >
      <Alert onClose={() => setEditSuccessAlert(false)} severity="success">
        Event Edited Successfully
      </Alert>
      </Snackbar>

      <Snackbar     
        open={showDeleteAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowDeleteAlert(false)}
      >
      <Alert onClose={() => setShowDeleteAlert(false)} severity="error">
        Deleted Successfully
      </Alert>
      </Snackbar>

      <Snackbar      
        open={showErrorAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowErrorAlert(false)}
      >
        <Alert onClose={() => setShowErrorAlert(false)} severity="error">
          Please fill all fields
        </Alert>
      </Snackbar>

      <Snackbar      
        open={showValAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowValAlert(false)}
      >
        <Alert onClose={() => setShowValAlert(false)} severity="error">
          Record Exists try with other Event Name
        </Alert>
      </Snackbar>


      {/* Event Table */}
      {/* <TableList/> */}
      <TableContainer component={Paper} sx={{ maxHeight: "360px",maxWidth:"99%",marginBottom: "30px"}}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"60px", color: "white" }}>Event Id </TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"400px", color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"200px" , color: "white"}}>Event Type</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>Start Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"100px" , color: "white"}}>End Date</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"150px", color: "white" }}>Last Date to Register</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"50px" , color: "white"}}>Delete</TableCell>
              <TableCell sx={{ backgroundColor: "#6C88C8", width:"50px" , color: "white"}}>Edit</TableCell> 
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
                <TableCell> <IconButton onClick={()=>deleteHandler(row.id)}><DeleteForeverIcon  sx={{ color: 'red'}}/></IconButton></TableCell>
                <TableCell><IconButton onClick={()=>editHandler(row)}><EditIcon  /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(tableData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}sx={{marginBottom:"10px"}}
      />
    </Box>
  );
};
