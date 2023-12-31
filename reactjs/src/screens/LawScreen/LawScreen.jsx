import { React, useState, useEffect } from "react";
import LawCards from "../../components/organisms/LawCards/LawCards";
import getLawsToVote from "../../api/getLawsToVote";
import { Button, CircularProgress } from "@material-ui/core";
import styles from "./LawScreen.styles";
import { useNavigate, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import settings from "../../settings.json";
import languages from "../../labels.json";

const LawScreen = ({ amend }) => {
  const labels = languages[settings.language];

  const [laws, setLaws] = useState({});
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const lawId = useLocation().pathname.split("/")[1];

  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem("hasLoadedBefore");
    if (!hasLoadedBefore) {
      window.location.reload();
      localStorage.setItem("hasLoadedBefore", "true");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    let result;
    let lambdaError;
    let hasLambdaError = false;
    for (let i = 0; i < 500; i++) {
      try {
        const session = await Auth.currentSession();
        const jwtToken = session.getIdToken().getJwtToken();
        setJwtToken(jwtToken);
        const userInfo = await Auth.currentUserInfo();
        const username = userInfo.username;
        setUsername(username);
        result = await getLawsToVote(username, jwtToken);
        setError("");
        setIsLoading(false);
        break;
      } catch (e) {
        if (i === 9) {
          lambdaError = e.message;
          hasLambdaError = true;
        }
      }
    }
    if (hasLambdaError) {
      setIsLoading(false);
      setError(lambdaError);
      return;
    }
    if (result.errorMessage) {
      setIsLoading(false);
      setError(result.errorMessage);
      return;
    }
    if (result[lawId]) {
      const lawWithId = {};
      lawWithId[lawId] = result[lawId];
      setLaws((laws) => ({
        ...laws,
        ...lawWithId,
      }));
    } else {
      setError(lawId + " is not a valid path");
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

  return (
    <>
      <div style={styles.tabs}>
        <Button
          style={{ marginLeft: 0, borderRadius: 0 }}
          color="inherit"
          variant="contained"
          onClick={homeScreenNavigate}
        >
          {labels.voteTab}
        </Button>
        <Button
          style={{ marginLeft: 0, borderRadius: 0 }}
          color="inherit"
          variant="contained"
          onClick={proposeLawNavigate}
        >
          {labels.proposeLawTab}
        </Button>
        <Button
          style={{ marginLeft: 0, borderRadius: 0 }}
          color="inherit"
          variant="contained"
          onClick={votedLawsNavigate}
        >
          {labels.votedLawsTab}
        </Button>
        <Button
          style={{ marginLeft: 0, borderRadius: 0 }}
          color="inherit"
          variant="contained"
          onClick={acceptedLawsNavigate}
        >
          {labels.acceptedLawsTab}
        </Button>
        <Button
          style={{ marginRight: "auto", borderRadius: 0 }}
          color="inherit"
          variant="contained"
          onClick={rejectedLawsNavigate}
        >
          {labels.rejectedLawsTab}
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
          maxWidth: "1700px",
        }}
      >
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="inherit" />
          </div>
        )}
        {error && (
          <div
            style={{
              color: "white",
              fontSize: 23,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {error}
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
