import { Card, Box } from "@mui/material";
import { AdminEvent } from "../EventList/AdminEvent";


const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginLeft="20px">
      <Card className="App-Card">
        <h3>List of Events</h3>
      </Card>
     
     <AdminEvent/>
    </Box>
  );
};

export default Home;
