import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";
import { useState } from "react";
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

const ExtraRegistration = () => {
  const [hasRegistered, setHasRegistered] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Defines the address of the cloud function for extra registration
    const addRegistrant = httpsCallable(functions, "addExtraRegistrantEurope");
    // Calls the cloud function
    await addRegistrant()
    // Shows waiting view
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
                Extra sale
              </Typography>

              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                onClick={handleSubmit}
              >
                Register
              </Button>
            </>
          ) : (
            <Typography variant="h2" padding={3} textAlign="center">
              You have registered. Wait for the organizer's confirmation.
            </Typography>
          )}
        </Box>
      </form>
    </div>
  );
};

export default ExtraRegistration;
