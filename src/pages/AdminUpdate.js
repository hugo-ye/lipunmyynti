import { Box, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const AdminUpdate = () => {
  const { authUser, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [updates, setUpdates] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "event", "memberExclusive");
      updateDoc(docRef, {
        updates: updates,
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
        const docSnapshot = await getDoc(doc(db, "event", "memberExclusive"));
        setUpdates(docSnapshot.data().updates);
      };
      fetchData();
    }
  }, [isAdmin]);

  return (
    <Container>
      <Box>
        <Typography variant="h1">Päivitystä lipunomistajille</Typography>
        <TextField
          defaultValue={updates}
          placeholder="Ei tiedotusta"
          multiline
          rows={20}
          sx={{ width: 600 }}
          onChange={(e) => setUpdates(e.target.value)}
        />
        <Button onClick={handleClick}>Update info</Button>
      </Box>
    </Container>
  );
};

export default AdminUpdate;
