import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";
import { useState } from "react";
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const ExtraRegistration = () => {
  const [hasRegistered, setHasRegistered] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addRegistrant = httpsCallable(functions, "addExtraRegistrantEurope");
    await addRegistrant()
    setHasRegistered(true);
  };
  return (
    <div>
      <form>
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
          {!hasRegistered ? (
            <>
              <Typography variant="h5" padding={3} textAlign="center">
                {" "}
                Uusi myynti käynnissä
              </Typography>

              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                onClick={handleSubmit}
              >
                Ilmoittaudu
              </Button>
            </>
          ) : (
            <Typography variant="h2" padding={3} textAlign="center">
              Olet rekisteröitynyt. Odota että bilevastaavan ilmoitusta.
            </Typography>
          )}
        </Box>
      </form>
    </div>
  );
};

export default ExtraRegistration;
