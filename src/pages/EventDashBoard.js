import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Box, Typography, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import Navbar from "../components/Navbar";

const EventDashBoard = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Defines states, dynamic data that are changed
  const [isEnabled, setIsEnabled] = useState(false);
  const [loadingResource, setLoadingResource] = useState(false);

  // Function for navigate button
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/event");
  };

  // Fetch data and determine whether the event is active
  useEffect(() => {
    // Function for the data fetch
    const fetchData = async (e) => {
      setLoadingResource(true);
      const docRef = doc(db, "event", "information"); // Document path
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setIsEnabled(docSnapshot.data().isActive);
      }
      setLoadingResource(false);
    };

    // Redirect to sign in if user is not authenticated
    if (!isLoading && !authUser) {
      navigate("/");
    }

    // fetch data if user is authenticated
    if (!isLoading && authUser) {
      fetchData();
    }
  }, [authUser, isLoading]);

  return !authUser || loadingResource || isLoading ? (
    <CircularProgress sx={{ marginLeft: "50%", marginTop: "25%" }} />
  ) : (
    <Box>
      <Stack>
        <Navbar />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          {!isEnabled ? (
            <Typography variant="h5">
              Lipunmyynti ei ole vielä alkanut.
            </Typography>
          ) : (
            <Button size="large" variant="contained" onClick={handleClick}>
              Bilesivu
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default EventDashBoard;
