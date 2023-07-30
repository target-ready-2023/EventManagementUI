import { Card, Box } from "@mui/material";
import { Admin_Event } from "../EventList/admin_event";


const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginLeft="20px">
      <Card className="App-Card">
        <h3>List of Events</h3>
      </Card>
     
     <Admin_Event/>
    </Box>
  );
};

export default Home;
