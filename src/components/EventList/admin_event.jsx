import React, { useState } from "react";
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
  makeStyles
} from "@mui/material";

const useStyles = makeStyles(theme =>({
  root:{
      top: theme.spacing(9)
  }
}))


export const Admin_Event = () => {
  const [formData, setFormData] = useState({
    Event_Name: "",
    Event_Type: "",
    Start_Date: "",
    End_Date: "",
    Last_Date_to_Register: "",
  });

  const [tableData, setTableData] = useState([
    // Your existing events data
  ]);

  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    //  validation to ensure all fields are filled properly.
    if(formData.Event_Name && formData.Event_Type && formData.Start_Date && formData.End_Date && formData.Last_Date_to_Register){
    setTableData((prevState) => [...prevState, { ...formData, id: tableData.length + 1 }]);
    // Reset the form data
    setFormData({
      Event_Name: "",
      Event_Type: "",
      Start_Date: "",
      End_Date: "",
      Last_Date_to_Register: "",
    });
    
    setOpen(false);
    setShowSuccessAlert(true); // Close the modal after submitting the form
    
  }
  else{
    setShowErrorAlert(true);
  }
    

  };

  const deleteHandler= (id)=>{

    const updatedTable = tableData.filter((curElement)=>{
      return curElement.id !== id;
    })
    setShowDeleteAlert(true);
    setTableData(updatedTable);
   
  }
  const classes = useStyles()
  return (
    <Box>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom:"20px" }}>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} startIcon= {<AddIcon/>}>
        Add Event
      </Button>
    </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          {/* Create Event Form */}
          <TextField
            name="Event_Name"
            value={formData.Event_Name}
            onChange={handleChange}
            label="Event Name"
            fullWidth
            margin="normal"

          />
          <TextField
            name="Event_Type"
            value={formData.Event_Type}
            onChange={handleChange}
            label="Event Type"
            fullWidth
            margin="normal"

          />
          <TextField
            name="Start_Date"
            value={formData.Start_Date}
            onChange={handleChange}
            label="Start Date"
            fullWidth
            margin="normal"

          />
          <TextField
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            label="End Date"
            fullWidth
            margin="normal"

          />
          <TextField
            name="Last_Date_to_Register"
            value={formData.Last_Date_to_Register}
            onChange={handleChange}
            label="Last Date to Register"
            fullWidth
            margin="normal"

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        className={classes.root}
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
        className={classes.root}
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
        className={classes.root}
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
                <TableCell><IconButton><EditIcon  /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
