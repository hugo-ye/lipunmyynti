import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const SignIn = () => {
  // Import authentication context, reusable state
  const { authUser, isLoading, signIn } = useAuth();
  const navigate = useNavigate();

  // Checks if logged in and redirects to the right URL
  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/eventdashboard");
    }
  }, [authUser, isLoading]);
  // Shows loading circle when the user account is loading
  return isLoading || (!isLoading && !!authUser) ? (
    <CircularProgress sx={{ marginLeft: "50%", marginTop: "25%" }} />
  ) : (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="primary.main"
      >
        {/*Page title*/}
        <Typography variant="h1" color="white">
          TK-bileet
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        {/*Page subtitle*/}
        <Typography variant="h2">Lipunmyynti</Typography>
        {/*Sign-in button*/}
        <Button variant="contained" onClick={signIn} sx={{ marginTop: 2 }}>
          Kirjaudu sisään Googlella
        </Button>
      </Box>
    </>
  );
};
export default SignIn;
