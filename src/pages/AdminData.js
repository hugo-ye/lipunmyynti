import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CommitChange from "../components/CommitChange";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@mui/material/Button";

const AdminData = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState("false");
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);
  const [distributed, setDistributed] = useState(true);

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
        let allUsers = [];
        const querySnapshot = await getDocs(collection(db, "registrants"));
        querySnapshot.forEach((doc) => {
          if (!!doc.data().uid) {
            allUsers.push(doc.data());
          }
        });
        setUsers(allUsers);
        const eventSnapshot = await getDoc(doc(db, "event", "information"));
        setDistributed(eventSnapshot.data().hasDistributedTickets);
      };
      fetchData();
    }
  }, [isAdmin]);

  const distributeTickets = async (e) => {
    e.preventDefault();
    const earliest = structuredClone(users);

    earliest.sort((a, b) =>
      a.registrationTime.seconds + a.registrationTime.nanoseconds / 1000000000 >
      b.registrationTime.seconds + b.registrationTime.nanoseconds / 1000000000
        ? 1
        : -1
    );

    try {
      for (let i = 0; i < 189; i++) {
        const uid = earliest[i].uid;
        const docRef = doc(db, "registrants", uid);
        await updateDoc(docRef, {
          isAdmitted: true,
        });
      }
      await updateDoc(doc(db, "event", "information"), {
        hasDistributedTickets: true,
      });
    } catch (e) {
    }
    window.location.reload();
  };

  const handleClick = (e) => {
    e.preventDefault()
    function isAdmitted(user) {
      return user.isAdmitted === true && user.hasPaid === true;
    }

    const printArray = users.filter(isAdmitted);
    printArray.sort(function (a, b) {
      return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
    });

    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Sukunimi", "Etunimi", "Luokka-aste"]],
      body: printArray.map((user) => {
        return [user.lastName, user.firstName, user.yearGroup];
      }),
    });
    doc.save("bouncer.pdf");
  };

  const columns = useMemo(
    () => [
      {
        field: "lastName",
        headerName: "Sukunimi",
        width: 200,
      },
      {
        field: "firstName",
        headerName: "Etunimi",
        width: 200,
      },
      {
        field: "yearGroup",
        headerName: "Luokka-aste",
        width: 200,
      },
      {
        field: "email",
        headerName: "Sähköposti",
        width: 200,
      },
      {
        field: "uid",
        headerName: "id",
        width: 200,
      },
      {
        field: "isAdmitted",
        headerName: "Omistaa lipun",
        width: 200,
        type: "boolean",
        editable: true,
      },
      {
        field: "hasPaid",
        headerName: "On maksanut",
        width: 200,
        type: "boolean",
        editable: true,
      },
      {
        field: "transferring",
        headerName: "Vaatii huomiota",
        width: 200,
        type: "boolean",
        editable: true,
      },

      {
        field: "actions",
        headerName: "Actions",
        Type: "actions",
        renderCell: (params) => (
          <CommitChange {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: "80vh",
        width: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      ></Typography>
      <DataGrid
        columns={columns}
        rows={users}
        getRowId={(row) => row.uid}
        rowsPerPageOptions={[20, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({})}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
      <Button variant="outlined" onClick={handleClick}>
        Print
      </Button>
      {!distributed && (
        <Button variant="outlined" onClick={distributeTickets}>
          188
        </Button>
      )}
    </Box>
  );
};

export default AdminData;
