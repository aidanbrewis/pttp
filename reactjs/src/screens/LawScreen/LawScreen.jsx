import { React, useState, useEffect } from "react";
import LawCards from "../../components/organisms/LawCards/LawCards";
import getLawsToVote from "../../api/getLawsToVote";
import { Button, CircularProgress } from "@material-ui/core";
import styles from "./LawScreen.styles";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

const LawScreen = ({ amend }) => {
  const [laws, setLaws] = useState({});
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const lawId = useLocation().pathname.split("/")[1];

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
    const result = await getLawsToVote(username, jwtToken);
    setIsLoading(false);
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    if (result[lawId]) {
      const lawWithId = {};
      lawWithId[lawId] = result[lawId];
      setLaws((laws) => ({
        ...laws,
        ...lawWithId,
      }));
    } else {
      throw Error(lawId + " is not a valid path");
    }
  };

  let navigate = useNavigate();

  const homeScreenNavigate = () => {
    let path = `/`;
    navigate(path);
  };

  const proposeLawNavigate = () => {
    let path = `/propose_law`;
    navigate(path);
  };

  const votedLawsNavigate = () => {
    let path = `/voted_laws`;
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
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="success" />
          </div>
        )}
        <LawCards
          laws={laws}
          username={username}
          jwtToken={jwtToken}
          hasTitleField={false}
          hasContentField={false}
          hasVotingButtons={true}
          hasProposeLawButton={false}
          lockExpanded={true}
          hasLawPageButton={false}
          amend={amend}
          hasUserVoteResults={false}
        />
      </div>
    </>
  );
};

export default LawScreen;
