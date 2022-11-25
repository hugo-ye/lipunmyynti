import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ResolveLog from "../components/ResolveLog";

const AdminLog = () => {
  const [isAdmin, setIsAdmin] = useState("false");
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(20);
  const [rowId, setRowId] = useState(null);
  const [logs, setLogs] = useState([]);

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
        let allLogs = [];
        const querySnapshot = await getDocs(collection(db, "transferLogs"));
        querySnapshot.forEach((doc) => {
          allLogs.push({
            fromEmail: doc.data().fromEmail,
            toEmail: doc.data().toEmail,
            id: doc.id,
          });
        });
        setLogs(allLogs);
      };
      fetchData();
    }
  }, [isAdmin]);

  const columns = useMemo(
    () => [
      {
        field: "fromEmail",
        headerName: "Myyjän sähköposti",
        width: 400,
      },
      {
        field: "toEmail",
        headerName: "Saajan sähköposti",
        width: 400,
      },
      {
        field: "id",
        headerName: "ID",
        width: 400,
      },

      {
        field: "resolved",
        headerName: "Ratkaistu",
        width: 400,
        type: "boolean",
        editable: true,
      },

      {
        field: "actions",
        headerName: "Actions",
        Type: "actions",
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
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      ></Typography>
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
