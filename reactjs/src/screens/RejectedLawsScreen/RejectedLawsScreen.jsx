import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import getRejectedLaws from "../../api/getRejectedLaws";
import LawCards from "../../components/organisms/LawCards/LawCards";
import { Button } from "@material-ui/core";
import styles from "./RejectedLawsScreen.styles";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

const RejectedLawsScreen = () => {
  const [laws, setLaws] = useState([]);
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const session = await Auth.currentSession();
    const jwtToken = session.getIdToken().getJwtToken();
    setJwtToken(jwtToken);
    const userInfo = await Auth.currentUserInfo();
    const username = userInfo.attributes.email;
    setUsername(username);
    const result = await getRejectedLaws(jwtToken);
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    setLaws(result);
  };

  let navigate = useNavigate();

  const proposeLawNavigate = () => {
    let path = `/propose_law`;
    navigate(path);
  };

  const votedLawsNavigate = () => {
    let path = `/voted_laws`;
    navigate(path);
  };

  const homeScreenNavigate = () => {
    let path = `/`;
    navigate(path);
  };

  const acceptedLawsNavigate = () => {
    let path = `/accepted_laws`;
    navigate(path);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: deepPurple[800],
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={styles.tabs}>
          <Button
            style={{ marginLeft: 0 }}
            color="inherit"
            variant="contained"
            onClick={homeScreenNavigate}
          >
            Vote
          </Button>
          <Button
            style={{ marginLeft: 0 }}
            color="inherit"
            variant="contained"
            onClick={proposeLawNavigate}
          >
            Propose New Law
          </Button>
          <Button
            style={{ marginLeft: 0 }}
            color="inherit"
            variant="contained"
            onClick={votedLawsNavigate}
          >
            Voted Laws
          </Button>
          <Button
            style={{ marginLeft: 0 }}
            color="inherit"
            variant="contained"
            onClick={acceptedLawsNavigate}
          >
            Accepted Laws
          </Button>
          <Button
            style={{ marginRight: "auto" }}
            color="primary"
            variant="contained"
          >
            Rejected Laws
          </Button>
        </div>
      </ThemeProvider>
      <div
        style={{
          margin: "auto",
          padding: 50,
          backgroundColor: "rgb(63,81,181)",
          justifyContent: "center",
          alignSelf: "center",
          overflow: "hidden",
          maxWidth: "1700px",
        }}
      >
        <LawCards
          laws={laws}
          username={username}
          jwtToken={jwtToken}
          hasTitleField={false}
          hasContentField={false}
          hasVotingButtons={false}
          hasProposeLawButton={false}
          lockExpanded={false}
          hasLawPageButton={false}
          amend={false}
          hasUserVoteResults={false}
        />
      </div>
    </>
  );
};

export default RejectedLawsScreen;
