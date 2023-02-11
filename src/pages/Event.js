import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";

import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import RegistrationForm from "../components/RegistrationForm";
import TransferAdmission from "../components/TransferAdmission";
import Information from "../components/Information";
import ExtraRegistration from "../components/ExtraRegistration";

const Event = () => {
  const { authUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isLoadingData, setIsLoadingData] = useState(false);

  /* States, variables that prompt components to re-render
    when they change. The following states contains the registrant's
    data fetched from the database.
     */
  const [hasPaid, setHasPaid] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [yearGroups, setYearGroups] = useState([]);
  const [information, setInformation] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [memberUpdates, setMemberUpdates] = useState("");

  const [canTransfer, setCanTransfer] = useState(false);
  const [hasDistributedTickets, setHasDistributedTickets] = useState(false);
  const [extraSale, setExtraSale] = useState(false);

  // Redirect function for back button
  const goBack = (e) => {
    e.preventDefault();
    navigate("/eventdashboard");
  };

  useEffect(() => {
    // Redirect to sign-in page if user is not authenticated
    if (!isLoading && !authUser) {
      navigate("/");
    } else if (!isLoading && authUser) {
      // Fetch data function
      const fetchEvent = async () => {
        setIsLoadingData(true);
        try {
          const docRef = doc(db, "event", "information");
          const docSnap = await getDoc(docRef);
          // Redirect to main page if event is not active
          if (docSnap.data().isActive !== true) {
            navigate("/eventdashboard");
          } else {
            const data = docSnap.data();
            setIsActive(true);
            setYearGroups(data.yearGroups);
            setInformation(data.information);
            setCanTransfer(data.canTransfer);
            setHasDistributedTickets(data.hasDistributedTickets);
            setExtraSale(data.extraSale);
          }
        } catch (error) {}
        setIsLoadingData(false);
      };

      fetchEvent();
    }
  }, [authUser, isLoading]);

  /* Fetch user specific data. UseEffect runs to change states in
   components with new data whenever its variables
   in the dependency array sees a change
     */
  useEffect(() => {
    if (isActive) {
      const fetchUserData = async () => {
        setIsLoadingData(true);
        try {
          // Path to the document of the registrant
          const docRef = doc(db, "registrants", authUser.uid);
          // Fetches the snapshot of the document
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setHasRegistered(true);
            // Sets the states with fetched value
            setIsAdmitted(docSnap.data().isAdmitted);
            setHasPaid(docSnap.data().hasPaid);
            setTransferring(docSnap.data().transferring);
          } else {
            setHasRegistered(false);
          }
        } catch (error) {
          console.log(error);
        }
        setIsLoadingData(false);
      };

      fetchUserData();
    }
  }, [isActive]); // Dependency array

  // Fetching exclusive data for ticket holders. Ran only if the user has a ticket
  useEffect(() => {
    if (isAdmitted) {
      const fetchExclusiveData = async () => {
        setIsLoadingData(true);
        try {
          const docRef = doc(db, "event", "memberExclusive");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMemberUpdates(docSnap.data().updates);
            setPaymentInfo(docSnap.data().paymentDetails);
          } else {
          }
        } catch (error) {}
        setIsLoadingData(false);
      };
      fetchExclusiveData();
    }
  }, [isAdmitted]);

  return (!isLoading && !authUser) || isLoadingData || !isActive ? (
    <CircularProgress sx={{ marginLeft: "50%", marginTop: "25%" }} />
  ) : (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="primary.main"
      >
        <Typography variant="h2" color="white">
          Your page
        </Typography>
      </Box>
      <Button onClick={goBack}>Back</Button>
      {!hasRegistered && (
        <>
          <Information message={information} />
          <RegistrationForm yearGroups={yearGroups} />
        </>
      )}
      {hasRegistered && (
        <>
          {transferring ? (
            <Information message="You have bought or sold a ticket. Wait for the organizer's confirmation." />
          ) : (
            <>
              {!isAdmitted && hasDistributedTickets && !extraSale && (
                <Information message="You do not have a ticket. You can wait for the extra sale or buy from a ticket-holder." />
              )}
              {!isAdmitted && hasDistributedTickets && extraSale && (
                <ExtraRegistration />
              )}
              {!isAdmitted && !hasDistributedTickets && (
                <Information message="You have registered. Wait a moment." />
              )}
              {isAdmitted && !hasPaid && <Information message={paymentInfo} />}
              {isAdmitted && hasPaid && (
                <>
                  <Information message={memberUpdates} />
                  {canTransfer && <TransferAdmission />}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
export default Event;
