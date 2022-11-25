import { Box, Typography } from "@mui/material";

const Update = ({ memberUpdates }) => {
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
      borderRadius={5}
      boxShadow={"5px 5px 10px #ccc"}
    >
      <Typography variant="h6">{memberUpdates}</Typography>
    </Box>
  );
};

export default Update;
