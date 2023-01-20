import { useAuth } from "../contexts/AuthContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const Navbar = () => {
  const { authUser, signOut } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{authUser?.email}</Typography>
        <Button
          style={{ color: "white", marginLeft: "auto" }}
          onClick={signOut}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
