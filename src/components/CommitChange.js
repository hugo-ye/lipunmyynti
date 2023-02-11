import React, { useEffect } from "react";
import { Box, CircularProgress, Fab } from "@mui/material";
import { useState } from "react";
import { Check, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const CommitChange = ({ params, rowId, setRowId }) => {
  // Declares the states, data that is dynamic and can change
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

// Save data function
  const handleSubmit = async (e) => {
    try {
      // Prevents window reload
      e.preventDefault();
      // Sets loading state to be true
      setLoading(true);
      // Uses the parameters from the specific row from the parent table
      const { isAdmitted, hasPaid, transferring, uid } = params.row;
      // Reference for the document in the database
      const userRef = doc(db, "registrants", uid);
      /* Updates the document with the new data,
      collection-specific data model specified here */
      await updateDoc(userRef, {
        isAdmitted: isAdmitted,
        hasPaid: hasPaid,
        transferring: transferring,
      }).then(() => {
        // Shows success icon
        setSuccess(true);
        // Resets the target row
        setRowId(null);
      });
      // sets loading state to be false
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  };
  // Resetting the success icon
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
      {/*Shows a Check symbol if success, shows save button if not*/}
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
      {/*Shows a loading symbol if loading*/}
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

export default CommitChange;
