import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import RegistrationForm from "../components/RegistrationForm";
import InformationWall from "../components/InformationWall";
import PaymentDetails from "../components/PaymentDetails";
import Update from "../components/Update";
import TransferAdmission from "../components/TransferAdmission";
import Information from "../components/Information";
import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";

const Event = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [yearGroups, setYearGroups] = useState([]);
  const [information, setInformation] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [memberUpdates, setMemberUpdates] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [canTransfer, setCanTransfer] = useState(false);
  const [hasDistributedTickets, setHasDistributedTickets] = useState(false);
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuth();

  const takaisin = (e) => {
    navigate("/eventdashboard")
  }

  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/");
    } else if (!isLoading && authUser) {
      const fetchEvent = async () => {
        setIsLoadingData(true);
        try {
          const docRef = doc(db, "event", "information");
          const docSnap = await getDoc(docRef);

          if (docSnap.data().isActive !== true) {
            navigate("/");
          } else {
            setIsActive(true);
            setYearGroups(docSnap.data().yearGroups);
            setInformation(docSnap.data().information);
            setCanTransfer(docSnap.data().canTransfer);
            setHasDistributedTickets(docSnap.data().hasDistributedTickets)

          }
        } catch (error) {
        }
        setIsLoadingData(false);
      };

      fetchEvent();
    }
  }, [authUser, isLoading]);

  useEffect(() => {
    if (isActive) {
      const fetchUserData = async () => {
        setIsLoadingData(true);
        try {
          const docRef = doc(db, "registrants", authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setHasRegistered(true);
            setIsAdmitted(docSnap.data().isAdmitted);
            setHasPaid(docSnap.data().hasPaid);
            setTransferring(docSnap.data().transferring);

          } else {
            setHasRegistered(false);
          }
          setIsLoadingData(false);
        } catch (error) {

        }
        setIsLoadingData(false);
      };
      fetchUserData();
    }
  }, [isActive]);

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
        } catch (error) {
        }
        setIsLoadingData(false);
      };
      fetchExclusiveData();
    }
  }, [isAdmitted]);

  return (!isLoading && !authUser) || isLoadingData || !isActive ? (
    <CircularProgress/>
  ) : (
    <>
      <Button onClick={takaisin}>Takaisin</Button>
      {hasRegistered && (
        <>
          {transferring ? (
            <Information message="Myit tai ostit juuri lipun. Odota kunnes hallituksen bilevastaava
              hoitaa tilanteen"/>
          ) : (
            <>
              {!isAdmitted && hasDistributedTickets &&(
                <Information message="Sinulla ei ole lippua. Voit kuitenkin ostaa lipun henkilöltä joka myy"/>
              )}
              {!isAdmitted && !hasDistributedTickets &&(
                  <Information message="Pieni hetki, ensimmäisiä 190 rekisteröidään tällä hetkellä"/>
              )}
              {isAdmitted && !hasPaid && (
                <PaymentDetails paymentInfo={paymentInfo} />
              )}
              {isAdmitted && hasPaid && (
                <>
                  <Update memberUpdates={memberUpdates} />
                  {canTransfer && <TransferAdmission />}
                </>
              )}
            </>
          )}
        </>
      )}
      {!hasRegistered && (
        <>
          <InformationWall information={information} />
          <RegistrationForm yearGroups={yearGroups} />
        </>
      )}
    </>
  );
};
export default Event;
