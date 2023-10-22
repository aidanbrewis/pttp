import { React, useState, useEffect } from "react";
import LawCards from "../../components/organisms/LawCards/LawCards";
import { Button } from "@material-ui/core";
import styles from "./ProposeLawScreen.styles";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple, pink } from "@mui/material/colors";

const ProposeLawScreen = () => {
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
  };

  let navigate = useNavigate();

  const homeScreenNavigate = () => {
    let path = `/`;
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
        main: pink[100],
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
          <Button style={{ marginLeft: 0 }} color="primary" variant="contained">
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
          laws={{ blank: { versions: {} } }}
          username={username}
          jwtToken={jwtToken}
          hasTitleField={true}
          hasContentField={true}
          hasVotingButtons={false}
          hasProposeLawButton={true}
          lockExpanded={true}
          hasLawPageButton={false}
          amend={false}
        />
      </div>
    </>
  );
};

export default ProposeLawScreen;
