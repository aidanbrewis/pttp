import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import getLawsToVote from "../../api/getLawsToVote";
import LawCards from "../../components/organisms/LawCards/LawCards";
import { Button, Container } from "@material-ui/core";
import styles from "./HomeScreen.styles";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple, pink } from "@mui/material/colors";

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

  const rejectedLawsNavigate = () => {
    let path = `/rejected_laws`;
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
          <Button style={{ marginLeft: 0 }} color="primary" variant="contained">
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
            onClick={acceptedLawsNavigate}
          >
            Accepted Laws
          </Button>
          <Button
            style={{ marginRight: "auto" }}
            color="inherit"
            variant="contained"
            onClick={rejectedLawsNavigate}
          >
            Rejected Laws
          </Button>
        </div>
        <div
          style={{
            margin: "auto",
            padding: 50,
            backgroundColor: "rgb(63,81,181)",
            justifyContent: "center",
            alignSelf: "center",
            overflow: "hidden",
            maxWidth: "80%",
          }}
        >
          <LawCards
            laws={laws}
            username={username}
            jwtToken={jwtToken}
            hasTitleField={false}
            hasContentField={false}
            hasVotingButtons={true}
            hasProposeLawButton={false}
            lockExpanded={false}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default HomeScreen;
