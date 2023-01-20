import React, { useEffect } from "react";
import { Box, CircularProgress, Fab } from "@mui/material";
import { useState } from "react";
import { Check, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ResolveExtraRegistration = ({ params, rowId, setRowId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { admitted, uid } = params.row;
      const requestRef = doc(db, "extraRegistration", uid);

      await updateDoc(requestRef, {
        admitted: admitted,
      }).then(() => {
        setSuccess(true);
        setRowId(null);
      });

      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [rowId]);

  return (
      <Box
          sx={{
            m: 1,
            position: "relative",
          }}
      >
        {success ? (
            <Fab
                color="primary"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: green[500],
                  "&:hover": { bgcolor: green[700] },
                }}
            >
              <Check />
            </Fab>
        ) : (
            <Fab
                color="primary"
                sx={{ width: 40, height: 40 }}
                disabled={params.id !== rowId || loading}
                onClick={handleSubmit}
            >
              <Save />
            </Fab>
        )}
        {loading && (
            <CircularProgress
                size={52}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
            />
        )}
      </Box>
  );
};

export default ResolveExtraRegistration;
