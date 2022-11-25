import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Stack } from "@mui/joy";

const EventDashBoard = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    navigate("/event");
  };

  useEffect(() => {
    const fetchData = async (e) => {
      const docRef = doc(db, "event", "information");
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        setIsEnabled(docSnapshot.data().isActive);
      }
    };
    if (!isLoading && !authUser) {
      navigate("/");
    }

    if (!isLoading && authUser) {
      fetchData();
    }
  }, [authUser, isLoading]);

  return !authUser ? (
    <CircularProgress />
  ) : (
    <Box>
      <Stack>
        <Navbar />
        {!isEnabled ? (
          <Typography variant="h5">
            Lipunmyynti ei ole vielä alkanut.
          </Typography>
        ) : (
          <div>
            <Button onClick={handleClick}>Bilesivu</Button>
          </div>
        )}
      </Stack>
    </Box>
  );
};

export default EventDashBoard;
