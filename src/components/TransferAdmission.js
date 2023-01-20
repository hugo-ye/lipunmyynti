import { useState } from "react";

import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";
import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const TransferAdmission = () => {
  const [toEmail, setToEmail] = useState("");
  const [hasSold, setHasSold] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const transferAdmission = httpsCallable(
      functions,
      "transferAdmissionEurope"
    );
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
        <Typography variant="h6">Yritetään lipunsiirtoa. Palaa sivulle muutaman minuutin kuluessa.</Typography>
      ) : (
        <>
          <Typography variant="h6">
            Myy lippu. Pidä huolta, että vastaanottaja on varmasti
            ilmoittautunut bileisiin.{" "}
          </Typography>
          <TextField
            margin="dense"
            variant="outlined"
            placeholder="Vastaanottajan sähköposti"
            onChange={(e) => setToEmail(e.target.value)}
            required
          />
          <Button
            sx={{ marginTop: 2 }}
            variant="contained"
            onClick={handleSubmit}
          >
            Myy
          </Button>
        </>
      )}
    </Box>
  );
};

export default TransferAdmission;

/*
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={"Transfer to"}
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          required
        />
        <button type={"submit"}>Submit</button>
      </form>
    </div>
  );
  
   */
