import { Box, Typography } from "@mui/material";

const Information = ({ message }) => {
  // Defines the view panel for all text information messages
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
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
};

export default Information;
