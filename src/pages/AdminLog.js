import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import ResolveLog from "../components/ResolveLog";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const AdminLog = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Defines states, dynamic data that are changed
  const [isAdmin, setIsAdmin] = useState("false");
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);
  const [logs, setLogs] = useState([]);

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

  // Fetches data and puts it in the array
  useEffect(() => {
    if (isAdmin && !isLoading && authUser) {
      const fetchData = async () => {
        let allLogs = [];
        const querySnapshot = await getDocs(collection(db, "transferLogs"));
        querySnapshot.forEach((doc) => {
          allLogs.push({
            fromEmail: doc.data().fromEmail,
            toEmail: doc.data().toEmail,
            id: doc.id,
            resolved: doc.data().resolved,
          });
        });
        setLogs(allLogs);
      };
      fetchData();
    }
  }, [isAdmin]);

  // Specifies the fields of the table
  const columns = useMemo(
    () => [
      {
        field: "fromEmail",
        headerName: "Myyjän sähköposti",
        flex: 1,
      },
      {
        field: "toEmail",
        headerName: "Saajan sähköposti",
        flex: 1,
      },
      {
        field: "id",
        headerName: "ID",
        flex: 1,
      },

      {
        field: "resolved",
        headerName: "Ratkaistu",
        flex: 1,
        type: "boolean",
        editable: true,
      },

      {
        field: "actions",
        headerName: "Actions",
        Type: "actions",
        // Save button, calls the component that commits changes to the database
        renderCell: (params) => <ResolveLog {...{ params, rowId, setRowId }} />,
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
        rows={logs}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[20, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({})}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default AdminLog;
