import { Box, Typography } from "@mui/material";

const InformationWall = ({ information }) => {
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
      <Typography variant="h6">{information}</Typography>
    </Box>
  );
};

export default InformationWall;
