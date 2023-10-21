import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import getLawsToVote from "../../api/getLawsToVote";
import LawCards from "../../components/organisms/LawCards/LawCards";
import { Button } from "@material-ui/core";
import styles from "./HomeScreen.styles";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const [laws, setLaws] = useState([]);
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const session = await Auth.currentSession();
      const jwtToken = session.getIdToken().getJwtToken();
      setJwtToken(jwtToken);
      const userInfo = await Auth.currentUserInfo();
      const username = userInfo.attributes.email;
      setUsername(username);
      const result = await getLawsToVote(username, jwtToken);
      if (result.errorMessage) {
        throw Error(result.errorMessage);
      }
      setLaws(result);
    } catch (error) {
      throw Error("Error fetching JWT token:", error);
    }
  };

  let navigate = useNavigate();

  const proposeLawNavigate = () => {
    let path = `/propose_law`;
    navigate(path);
  };

  const acceptedLawsNavigate = () => {
    let path = `/accepted_laws`;
    navigate(path);
  };

  return (
    <>
      <div
        style={{
          margin: "auto",
          padding: 150,
          backgroundColor: "rgb(92,92,92)",
          justifyContent: "center",
          alignSelf: "center",
          overflow: "hidden",
          maxWidth: "60%",
        }}
      >
        <div style={styles.proposalButton}>
          <Button
            color="inherit"
            variant="contained"
            onClick={proposeLawNavigate}
          >
            Propose New Law
          </Button>
          <Button
            color="inherit"
            variant="contained"
            onClick={acceptedLawsNavigate}
          >
            Accepted Laws
          </Button>
        </div>
        <LawCards
          laws={laws}
          username={username}
          jwtToken={jwtToken}
          hasVotingButtons={true}
        />
      </div>
    </>
  );
};

export default HomeScreen;
