import { useAuth } from "../contexts/AuthContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const Navbar = () => {
  const { authUser, signOut } = useAuth();
  // Navigation bar
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Shows the authenticated user's email */}
        <Typography variant="h6">{authUser?.email}</Typography>
        {/* Shows the button to sign out on the very right end*/}
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
