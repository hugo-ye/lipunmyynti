import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
} from "@mui/material";
import Button from "@mui/material/Button";

const AdminSetup = () => {
  const { authUser, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [quota, setQuota] = useState(0);
  const [information, setInformation] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [canTransfer, setCanTransfer] = useState(false);
  const [yearGroups, setYearGroups] = useState([]);
  const navigate = useNavigate();
  const { event, setEvent } = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "event", "information");
      updateDoc(docRef, {
        canTransfer: canTransfer,
        information: information,
        isActive: isActive,
        quota: quota,
        yearGroups: yearGroups,
      });
    } catch (e) {
    }
  };

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
      };
      fetchData();
    }
  }, [isAdmin]);
  return (
    <Box>
      <Typography variant="h1">Asetukset</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item>
              <Typography variant="h3">Bileen tiedot</Typography>
              <TextField
                defaultValue={information}
                placeholder="Ei mitään"
                multiline
                rows={10}
                sx={{ width: 400 }}
                onChange={(e) => setInformation(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item>
              <Typography variant="h4">Lipunmyynti alkanut</Typography>
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4">Voi vaihtaa lippua</Typography>
              <Switch
                checked={canTransfer}
                onChange={(e) => setCanTransfer(e.target.checked)}
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleSubmit}>
                Tallenna
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminSetup;
