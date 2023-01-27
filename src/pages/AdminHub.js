import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase/firebase";

import { useAuth } from "../contexts/AuthContext";

import { doc, getDoc } from "firebase/firestore";

import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const AdminHub = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Routes to sign-in page if user is not authenticated or is not an admin
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/");
    } else if (!isLoading && authUser) {
      const docRef = doc(db, "admins", authUser.uid);
      const fetchIsAdmin = async () => {
        try {
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            navigate("/");
          }
        } catch (error) {
          navigate("/");
        }
      };
      fetchIsAdmin();
    }
  }, [authUser, isLoading]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="75vh"
    >
      {/* Creates buttons and titles for navigating to specific admin pages */}
      <Typography variant="h1">Adminin sivut</Typography>
      <Button href="/admindata" variant="contained" sx={{ margin: 2 }}>
        Registrants
      </Button>
      <Button href="/adminsetup" variant="contained" sx={{ margin: 2 }}>
        Setup
      </Button>
      <Button href="/adminupdate" variant="contained" sx={{ margin: 2 }}>
        Updates
      </Button>
      <Button href="/adminlog" variant="contained" sx={{ margin: 2 }}>
        Ticket transfers
      </Button>
      <Button href="/adminextra" variant="contained" sx={{ margin: 2 }}>
        Extra registration
      </Button>
      <Button href="/adminclear" variant="contained" sx={{ margin: 2 }}>
        Clear data
      </Button>
    </Box>
  );
};

export default AdminHub;
