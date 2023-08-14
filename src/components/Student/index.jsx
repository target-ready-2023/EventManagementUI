import React from "react"; // Make sure to import React
import { Card } from "@mui/material";
// import RegisterPage from './registerPage'; // Import using PascalCase naming convention
import StudentProfile from './studentProfile'
const Student = () => {
    return (
        <Card className="App-Card"  style={{ marginBottom: "40px" }}>
            <h3>List of Events that you have registered</h3>
            <StudentProfile/>
        </Card>
    );
};

export default Student;
