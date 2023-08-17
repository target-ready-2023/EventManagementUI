import React from "react"; // Make sure to import React
import { Card } from "@mui/material";
import RegisterPage from '../Student/registerPage'; // Import using PascalCase naming convention

const Event = () => {
    return (
        <Card className="App-Card"  style={{ marginBottom: "40px" }}>
            <h3>Upcoming Events</h3>
            <RegisterPage state ={"upcoming"} /> {/* Use the component here */}
            <h3>Closed Events</h3>
            <RegisterPage state ={"old"}/>
        </Card>
    );
};

export default Event;
