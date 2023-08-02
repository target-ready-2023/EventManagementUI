import React, { useState,useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import {
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




export const Admin_Event = () => {
  const [formData, setFormData] = useState({
    Event_Name: "",
    Event_Type: "",
    Start_Date: "",
    End_Date: "",
    Last_Date_to_Register: "",
  });
  
  const [tableData, setTableData] = useState([
    // Existing events data
  ]);

  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setEditSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
  const [lastDateRegister,setLastDateRegister] = useState("");
  


  const theme = useTheme();

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      Start_Date: e.target.value,
    }));

  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setFormData((prevState) => ({     
      ...prevState,
      End_Date: e.target.value,
    }));
  };

  const handleLastRegisterDateChange = (e) => {
    setLastDateRegister(e.target.value);
    setFormData((prevState) => ({      
      ...prevState,
      Last_Date_to_Register: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
  
      setFormData({
        Event_Name: "",
        Event_Type: "",
        Start_Date: "",
        End_Date: "",
        Last_Date_to_Register: "",
      });
      setStartDate("");
      setEndDate("");
      setLastDateRegister("");
    
  }, []);

  const handleCancel=()=>{
    setFormData({
      Event_Name: "",
      Event_Type: "",
      Start_Date: "",
      End_Date: "",
      Last_Date_to_Register: "",
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setEditingRecord(null);
    setOpen(false);

  }
  const handleUpdate = () => {
    const index = tableData.findIndex((record) => record.id === editingRecord.id);
    const updatedTableData = [...tableData];
    updatedTableData[index] = formData;
    updatedTableData[index].id = index + 1;
    setTableData(updatedTableData);
    setFormData({
      Event_Name: "",
      Event_Type: "",
      Start_Date: "",
      End_Date: "",
      Last_Date_to_Register: "",
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
        Event_Name: editingRecord.Event_Name,
        Event_Type: editingRecord.Event_Type,
        Start_Date: editingRecord.Start_Date,
        End_Date: editingRecord.End_Date,
        Last_Date_to_Register: editingRecord.Last_Date_to_Register,
      });
      setStartDate(editingRecord.Start_Date);
      setEndDate(editingRecord.End_Date);
      setLastDateRegister(editingRecord.Last_Date_to_Register);
    }
  }, [editingRecord]);

  const handleSubmit = () => {
    //  validation to ensure all fields are filled properly.
    if(formData.Event_Name && formData.Event_Type && formData.Start_Date && formData.End_Date && formData.Last_Date_to_Register)
    {
    setTableData((prevState) => [...prevState, { ...formData, id: tableData.length + 1, Start_Date:startDate, End_Date:endDate,Last_Date_to_Register:lastDateRegister }]);
    // Reset the form data
    setFormData({
      Event_Name: "",
      Event_Type: "",
      Start_Date: "",
      End_Date: "",
      Last_Date_to_Register: "",
    });
    setStartDate("");
    setEndDate("");
    setLastDateRegister("");
    setOpen(false);
    setShowSuccessAlert(true); // Close the modal after submitting the form
    
  }
  else{
    setShowErrorAlert(true);
  }
    

  };

  const editHandler = (record)=>{
    setEditingRecord(record);
    setOpen(true);
  }
  const deleteHandler= (id)=>{

    const updatedTable = tableData.filter((curElement)=>{
      return curElement.id !== id;
    })
    setShowDeleteAlert(true);
    setTableData(updatedTable);
   
  }


  
  return (
    <Box>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom:"20px" }}>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} startIcon= {<AddIcon/>}>
        Add Event
      </Button>
    </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingRecord ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          {/* Create Event Form */}
          
          <TextField
            name="Event_Name"
            value={formData.Event_Name}
            onChange={handleChange}
            label="Event Name"
            required
            fullWidth
            margin="normal"

          />
          <TextField
            name="Event_Type"
            value={formData.Event_Type}
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
            required
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
            required
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


      {/* Event Table */}
      <TableContainer component={Paper} sx={{ maxHeight: "400px",maxWidth:"99%"}}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "lightblue", width:"50px" }}>Sl NO.</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"400px" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"200px" }}>Event Type</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"100px" }}>Start Date</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"100px" }}>End Date</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"150px" }}>Last Date to Register</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"50px" }}>Delete</TableCell>
              <TableCell sx={{ backgroundColor: "lightblue", width:"50px" }}>Edit</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ maxWidth: "300px" }}>{row.Event_Name}</TableCell>
                <TableCell>{row.Event_Type}</TableCell>
                <TableCell>{row.Start_Date}</TableCell>
                <TableCell>{row.End_Date}</TableCell>
                <TableCell>{row.Last_Date_to_Register}</TableCell>
                <TableCell> <IconButton onClick={()=>deleteHandler(row.id)}><DeleteForeverIcon  sx={{ color: 'red'}}/></IconButton></TableCell>
                <TableCell><IconButton onClick={()=>editHandler(row)}><EditIcon  /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
