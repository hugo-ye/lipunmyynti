import { useState } from "react";

import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";
import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const TransferAdmission = () => {
  const [toEmail, setToEmail] = useState("");
  const [hasSold, setHasSold] = useState(false);

  // Function for transferring ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Defines the address of the cloud function
    const transferAdmission = httpsCallable(
      functions,
      "transferAdmissionEurope"
    );
    // Calls the cloud function with the authentication session's email as a parameter
    setHasSold(true);
    await transferAdmission({
      toEmail: toEmail,
    })
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth={400}
      alignItems="center"
      justifyContent="center"
      margin="auto"
      marginTop={5}
      padding={5}
      boxShadow={"5px 5px 10px #ccc"}
    >
      {hasSold ? (
        <Typography variant="h6">Attempting to transfer. Return to this page in a few minutes.</Typography>
      ) : (
        <>
          <Typography variant="h6">
            Transfer ticket. Make sure that the receiver has registered for the event. {" "}
          </Typography>
          <TextField
            margin="dense"
            variant="outlined"
            placeholder="Receiver email"
            onChange={(e) => setToEmail(e.target.value)}
            required
          />
          <Button
            sx={{ marginTop: 2 }}
            variant="contained"
            onClick={handleSubmit}
          >
            Transfer
          </Button>
        </>
      )}
    </Box>
  );
};

export default TransferAdmission;


  

