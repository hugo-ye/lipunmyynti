import { useState, useEffect } from "react";
import {Box} from "@mui/material";

const PaymentDetails = ({paymentInfo}) => {
  const [data, setData] = useState("");

  return <Box
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
  >{paymentInfo}</Box>;
};

export default PaymentDetails;