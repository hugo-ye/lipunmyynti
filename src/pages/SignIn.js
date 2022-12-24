import { useAuth } from "../contexts/AuthContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const SignIn = () => {
  const { authUser, isLoading, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/eventdashboard");
    }
  }, [authUser, isLoading]);
  //Returns loading if it is loading or it is not loading and there is an authuser
  return isLoading || (!isLoading && !!authUser) ? (
    <CircularProgress />
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h2">TK-bileet</Typography>
      <Button variant="contained" onClick={signIn}>
        Kirjaudu sisäään Google-tilillä!
      </Button>
    </Box>
  );
};
export default SignIn;
