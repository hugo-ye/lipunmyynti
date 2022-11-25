import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";
import { Box, Select, TextField, Typography, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";

const RegistrationForm = ({ yearGroups }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearGroup, setYearGroup] = useState(yearGroups[0]);
  const [hasRegistered, setHasRegistered] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const addRegistrant = httpsCallable(functions, "addRegistrantEurope");
    await addRegistrant({
      firstName: firstName,
      lastName: lastName,
      yearGroup: yearGroup,
    }).then((result) => {
    });
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
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
        >
          {!hasRegistered ? (
            <>
              <Typography variant="h2" padding={3} textAlign="center">
                {" "}
                TK-bileet 2022
              </Typography>
              <TextField
                margin="dense"
                variant="outlined"
                placeholder="Etunimi"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                margin="dense"
                variant="outlined"
                placeholder="Sukunimi"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Select
                name="Luokka-aste"
                label="Luokka-aste"
                value={yearGroup}
                sx={{ minWidth: 100, marginTop: 2 }}
                onChange={(e) => setYearGroup(e.target.value)}
              >
                {yearGroups.map((option, key) => (
                  <MenuItem value={option} key={key}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
              Olet rekisteröitynyt. Päivitä sivu muutaman minuutin kuluttua
            </Typography>
          )}
        </Box>
      </form>
    </div>
  );
};

export default RegistrationForm;
