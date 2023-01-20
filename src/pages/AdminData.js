import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { Box, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import CommitChange from "../components/CommitChange";

const AdminData = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState("false");
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);
  const [distributed, setDistributed] = useState(true);
  const [quota, setQuota] = useState(0);

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

  // Fetches data from the database
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        let allUsers = [];
        const querySnapshot = await getDocs(collection(db, "registrants"));
        querySnapshot.forEach((doc) => {
          if (!!doc.data().uid) {
            allUsers.push(doc.data());
          }
        });
        setUsers(allUsers);
        const eventSnapshot = await getDoc(doc(db, "event", "information"));
        setQuota(eventSnapshot.data().quota);
        setDistributed(eventSnapshot.data().hasDistributedTickets);
      };
      fetchData();
    }
  }, [isAdmin]);

  // Defines the function for distributing the tickets
  const distributeTickets = async (e) => {
    e.preventDefault();
    const earliest = structuredClone(users);
    // Sorts the list of registrants by the registration time exact to the thousandth of a second
    earliest.sort((a, b) =>
      a.registrationTime.seconds + a.registrationTime.nanoseconds / 1000000000 >
      b.registrationTime.seconds + b.registrationTime.nanoseconds / 1000000000
        ? 1
        : -1
    );
    // Updates the data to the database for all the earliest users
    try {
      for (let i = 0; i < quota; i++) {
        const uid = earliest[i].uid;
        const docRef = doc(db, "registrants", uid);
        await updateDoc(docRef, {
          isAdmitted: true,
        });
      }
      // Updates to the database that tickets have been distributed for the event
      await updateDoc(doc(db, "event", "information"), {
        hasDistributedTickets: true,
      });
    } catch (e) {}
    window.location.reload();
  };
  // Defines the function that prints the namelist
  const printNameList = (e) => {
    e.preventDefault();
// Defines a function that filters the list of registrants by ticket possession and successful payment
    function isAdmitted(registrant) {
      return registrant.isAdmitted === true && registrant.hasPaid === true;
    }

    const printArray = users.filter(isAdmitted);

    // Sorts the list alphabetically disregarding capitalization
    printArray.sort(function (a, b) {
      return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
    });

    // Creates a pdf document with only the necessary fields
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Sukunimi", "Etunimi", "Luokka-aste"]],
      body: printArray.map((user) => {
        return [user.lastName, user.firstName, user.yearGroup];
      }),
    });
    // Saves the pdf to the computer
    doc.save("bouncer.pdf");
  };

  // Specifies the fields of the table
  const columns = useMemo(
    () => [
      {
        field: "lastName",
        headerName: "Sukunimi",
        flex: 1,
      },
      {
        field: "firstName",
        headerName: "Etunimi",
        flex: 1,
      },
      {
        field: "yearGroup",
        headerName: "Luokka-aste",
        flex: 1,
      },
      {
        field: "email",
        headerName: "Sähköposti",
        flex: 1,
      },
      {
        field: "uid",
        headerName: "id",
        flex: 1,
      },
      {
        field: "isAdmitted",
        headerName: "Omistaa lipun",
        flex: 1,
        type: "boolean",
        editable: true,
      },
      {
        field: "hasPaid",
        headerName: "On maksanut",
        flex: 1,
        type: "boolean",
        editable: true,
      },
      {
        field: "transferring",
        headerName: "Vaatii huomiota",
        flex: 1,
        type: "boolean",
        editable: true,
      },

      {
        field: "actions",
        headerName: "Actions",
        Type: "actions",
        // Save button, calls the component that commits changes to the database
        renderCell: (params) => (
          <CommitChange {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  return (
    <div>
      <Box
        sx={{
          height: "80vh",
          width: "100%",
        }}
      >
        <Typography sx={{ textAlign: "center", mt: 3, mb: 3 }}></Typography>
        {/* Creates a table of the data*/}
        <DataGrid
          columns={columns}
          rows={users}
          getRowId={(row) => row.uid}
          rowsPerPageOptions={[20, 50, 100]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          getRowSpacing={(params) => ({})}
          onCellEditCommit={(params) => setRowId(params.id)}
        />
      </Box>
      <Box display="flex" marginTop={2}>
        <Stack spacing={2}>
          {/* Shows the button that prints the namelist*/}
          <Button variant="contained" onClick={printNameList}>
            Tulosta nimilista
          </Button>
          {/* Shows distribute tickets button if tickets have not yet been distributed*/}
          {!distributed && (
            <Button variant="contained" onClick={distributeTickets}>
              Valitaan {quota}
            </Button>
          )}
        </Stack>
      </Box>
    </div>
  );
};

export default AdminData;
