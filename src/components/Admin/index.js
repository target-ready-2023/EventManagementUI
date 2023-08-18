import { Card, Box } from "@mui/material";
import { AdminEvent } from "../EventList/AdminEvent";

const Admin = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginLeft="20px">
      <Card className="App-Card">
        <h3>List of Events</h3>
      </Card>
     {/* <RoleSelection/> */}
     <AdminEvent/>
    </Box>
  );
};

export default Admin;
