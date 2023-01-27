import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import moment from "moment";

import ResolveExtraRegistration from "../components/ResolveExtraRegistration";

const AdminExtra = () => {
  const [isAdmin, setIsAdmin] = useState("false");
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);
  const [requests, setRequests] = useState([]);

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

  // Fetches data for the data table from the database
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        let allRequests = [];
        const querySnapshot = await getDocs(
          collection(db, "extraRegistration")
        );
        querySnapshot.forEach((doc) => {
          allRequests.push({
            email: doc.data().email,
            registrationTime: doc.data().registrationTime.toDate(),
            admitted: doc.data().admitted,
            uid: doc.data().uid,
          });
        });

        // Sorts the fetched data by registration time
        allRequests.sort((a, b) =>
            a.registrationTime.seconds + a.registrationTime.nanoseconds / 1000000000 >
            b.registrationTime.seconds + b.registrationTime.nanoseconds / 1000000000
                ? 1
                : -1
        );
        setRequests(allRequests);
      };
      fetchData();
    }
  }, [isAdmin]);

  // Specifies the fields of the table
  const columns = useMemo(
    () => [
      {
        field: "email",
        headerName: "Email",
        flex: 1,
      },
      {
        field: "registrationTime",
        headerName: "Registration time",
        renderCell: (params) =>
          moment(params.row.registrationTime).format("MMMM Do YYYY, h:mm:ss a"),
        flex: 1,
      },
      {
        field: "uid",
        headerName: "uid",
        flex: 1,
      },

      {
        field: "admitted",
        headerName: "Approved",
        flex: 1,
        type: "boolean",
        editable: true,
      },

      {
        field: "actions",
        headerName: "Save",
        Type: "actions",
        renderCell: (params) => (
            // Save button, calls the component that commits changes to the database
            <ResolveExtraRegistration {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  return (
    <Box
      sx={{
        height: "95vh",
        width: "100%",
      }}
    >
      <Typography
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      ></Typography>
      {/* Creates a table of the data*/}
      <DataGrid
        columns={columns}
        rows={requests}
        getRowId={(row) => row.uid}
        rowsPerPageOptions={[20, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({})}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default AdminExtra;
