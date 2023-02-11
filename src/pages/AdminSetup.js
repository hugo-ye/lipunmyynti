import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import {
  Box,
  Typography,
  TextField,
  Switch,
  Stack,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";

const AdminSetup = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Defines states, dynamic data that are changed
  const [isAdmin, setIsAdmin] = useState(false);
  const [quota, setQuota] = useState(null);
  const [information, setInformation] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [canTransfer, setCanTransfer] = useState(false);
  const [yearGroups, setYearGroups] = useState([]);
  const [hasDistributedTickets, setHasDistributedTickets] = useState(false);
  const [extraSale, setExtraSale] = useState(false);
  const [warning, setWarning] = useState(false);

  // Writes edited data about the event to the database
  const handleSubmit = async (e) => {
    // Defines a function that checks user input is numeric
    function isNumeric(str) {
      // Initial state of state is an int, only user input is string. Hence ignore if is already number
      if (typeof str === "number") {
        return true;
      } else if (typeof str != "string") return false; // If it is any other than number or string, it is not processed

      return !isNaN(str) && !isNaN(parseFloat(str));
    }

    e.preventDefault();
    if (!isNumeric(quota)) {
      setWarning(true);
    } else {
      try {
        const docRef = doc(db, "event", "information");
        await updateDoc(docRef, {
          canTransfer: canTransfer,
          information: information,
          isActive: isActive,
          quota: Number(quota),
          yearGroups: yearGroups,
          hasDistributedTickets: hasDistributedTickets,
          extraSale: extraSale
        });
      } catch (e) {}
      window.location.reload();
    }
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

  // Fetches existing data for the settings and sets them as placeholder
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        const docSnapshot = await getDoc(doc(db, "event", "information"));
        const data = docSnapshot.data();
        setIsActive(data.isActive);
        setInformation(data.information);
        setQuota(data.quota);
        setCanTransfer(data.canTransfer);
        setYearGroups(data.yearGroups);
        setHasDistributedTickets(data.hasDistributedTickets);
        setExtraSale(data.extraSale)
      };
      fetchData();
    }
  }, [isAdmin]);
  return (
    <>
      {warning && <Alert severity="error">The quota must be an integer!</Alert>}
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h1">Setup</Typography>
        <Stack>
          <Typography variant="h3">Event information</Typography>
          <TextField
            defaultValue={information}
            placeholder="Bileen tiedot tähän"
            multiline
            margin="normal"
            rows={10}
            sx={{ width: 400 }}
            onChange={(e) => setInformation(e.target.value)}
          ></TextField>
          <Typography variant="h4">Event active</Typography>
          <Switch
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <Typography variant="h4">Quota</Typography>
          <TextField
            value={quota}
            type="number"
            onChange={(e) => setQuota(e.target.value)}
          />
          <Typography variant="h4">Tickets distributed</Typography>
          <Switch
            checked={hasDistributedTickets}
            onChange={(e) => setHasDistributedTickets(e.target.checked)}
          />
          <Typography variant="h4">Can transfer ticket</Typography>
          <Switch
            checked={canTransfer}
            onChange={(e) => setCanTransfer(e.target.checked)}
          />
          <Typography variant="h4">Extra registration</Typography>
          <Switch
              checked={extraSale}
              onChange={(e) => setExtraSale(e.target.checked)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default AdminSetup;
