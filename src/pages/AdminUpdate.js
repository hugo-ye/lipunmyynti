import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const AdminUpdate = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Defines states, dynamic data that are changed
  const [isAdmin, setIsAdmin] = useState(false);
  const [updates, setUpdates] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  // Function for updating database with edited information
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "event", "memberExclusive");
      await updateDoc(docRef, {
        updates: updates,
        paymentDetails: paymentDetails,
      });
    } catch (e) {}
    window.location.reload();
  };

  // Routes to sign-in page if user is not authenticated or is not an admin
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/");
    } else if (!isLoading && authUser) {
      const docRef = doc(db, "admins", authUser.uid);
      const fetchIsAdmin = async () => {
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().isAdmin) {
            setIsAdmin(docSnap.data().isAdmin);
          } else {
            navigate("/");
          }
        } catch (error) {
          navigate("/");
        }
      };
      fetchIsAdmin();
    }
  }, [authUser, isLoading]);

  // Fetches existing data for the text boxes as placeholder
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        const docSnapshot = await getDoc(doc(db, "event", "memberExclusive"));
        setUpdates(docSnapshot.data().updates);
        setPaymentDetails(docSnapshot.data().paymentDetails);
      };
      fetchData();
    }
  }, [isAdmin]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h1">Päivitystä lipunomistajille</Typography>
      <Typography variant="h4">Tiedotukset</Typography>
      {/* Text field for editing information updates*/}
      <TextField
        defaultValue={updates}
        placeholder="Ei tiedotusta"
        multiline
        rows={10}
        sx={{ width: 600 }}
        margin="normal"
        onChange={(e) => setUpdates(e.target.value)}
      />
      <Typography variant="h4">Maksutiedot</Typography>
      {/* Text field for editing payment details*/}
      <TextField
        defaultValue={paymentDetails}
        placeholder="Ei maksutietoja"
        multiline
        rows={10}
        sx={{ width: 600 }}
        margin="normal"
        onChange={(e) => setPaymentDetails(e.target.value)}
      />
      {/* Submit button for saving data*/}
      <Button variant="contained" sx={{ marginTop: 1 }} onClick={handleClick}>
        Update info
      </Button>
    </Box>
  );
};

export default AdminUpdate;
