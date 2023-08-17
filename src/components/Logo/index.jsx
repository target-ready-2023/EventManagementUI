import DSF from "../../images/DSF_Logo.png";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link to="/"> {/* This will navigate to the home route */}
    <img src={DSF} className="App-logo" alt="logo" title="Target Ready Logo" />
    </Link>
  );
};
export default Logo;
