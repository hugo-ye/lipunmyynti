import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getCountFromServer,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";

const AdminClear = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Defines states, dynamic data that are changed
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrantCount, setRegistrantCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [extraCount, setExtraCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    /* Defines a function that reads all the existing documents in a collection
        and deletes them by calling delete on the document id*/
    const clearRegistrants = async () => {
      let allRegistrants = [];
      const querySnapshot = await getDocs(collection(db, "registrants"));
      querySnapshot.forEach((doc) => {
        allRegistrants.push(doc.id);
      });
      for (const registrant of allRegistrants) {
        await deleteDoc(doc(db, "registrants", registrant));
      }
    };

    const clearTransferLogs = async () => {
      let allTransferLogs = [];
      const querySnapshot = await getDocs(collection(db, "transferLogs"));
      querySnapshot.forEach((doc) => {
        allTransferLogs.push(doc.id);
      });
      for (const transferLog of allTransferLogs) {
        await deleteDoc(doc(db, "transferLogs", transferLog));
      }
    };

    const clearExtraRegistrants = async () => {
      let allExtraRegistrants = [];
      const querySnapshot = await getDocs(collection(db, "extraRegistration"));
      querySnapshot.forEach((doc) => {
        allExtraRegistrants.push(doc.id);
      });

      for (const extraRegistrant of allExtraRegistrants) {
        await deleteDoc(doc(db, "extraRegistration", extraRegistrant));
      }
    };

    await clearRegistrants();
    await clearTransferLogs();
    await clearExtraRegistrants();
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

  // Fetches the count of documents in the registrant collection in the database
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        const regColl = collection(db, "registrants");
        const regSnap = await getCountFromServer(regColl);
        setRegistrantCount(regSnap.data().count);
        const transferColl = collection(db, "transferLogs");
        const transferSnap = await getCountFromServer(transferColl);
        setTransferCount(transferSnap.data().count);
        const extraColl = collection(db, "extraRegistration");
        const extraSnap = await getCountFromServer(extraColl);
        setExtraCount(extraSnap.data().count);
      };
      fetchData();
    }
  }, [isAdmin]);

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h1">Clear data</Typography>
      <Typography variant="h4">Registrant count:</Typography>
      <Card>
        {/* Shows the count of registrants for reference of data existence in the database*/}
        <Typography variant="h5">{registrantCount}</Typography>
      </Card>

      <Typography variant="h4">Transfer count:</Typography>
      <Card>
        {/* Shows the count of registrants for reference of data existence in the database*/}
        <Typography variant="h5">{transferCount}</Typography>
      </Card>

      <Typography variant="h4">Extra sale count</Typography>
      <Card>
        {/* Shows the count of registrants for reference of data existence in the database*/}
        <Typography variant="h5">{extraCount}</Typography>
      </Card>

      <Typography variant="h4">
        Click here to clear all 3 collections.
      </Typography>
      {/* Shows a button that calls the dialog for confirmation*/}
      <Button
        variant="contained"
        sx={{ marginTop: 1 }}
        onClick={() => setDeleting(true)}
      >
        Clear
      </Button>
      {/* Shows a dialog for confirmation of data deletion*/}
      <Dialog open={deleting} onClose={() => setDeleting(false)}>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleted data can not be recovered!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(false)}>Exit</Button>
          <Button onClick={handleClick} autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminClear;
