import { React, useState, useEffect } from "react";
import LawCards from "../../components/organisms/LawCards/LawCards";
import { Button } from "@material-ui/core";
import styles from "./ProposeLawScreen.styles";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import settings from "../../settings.json";
import languages from "../../labels.json";

const ProposeLawScreen = () => {
  const labels = languages[settings.language];

  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem("hasLoadedBefore");
    if (!hasLoadedBefore) {
      window.location.reload();
      localStorage.setItem("hasLoadedBefore", "true");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const session = await Auth.currentSession();
    const jwtToken = session.getIdToken().getJwtToken();
    setJwtToken(jwtToken);
    const userInfo = await Auth.currentUserInfo();
    const username = userInfo.username;
    setUsername(username);
  };

  let navigate = useNavigate();

  const homeScreenNavigate = () => {
    let path = `/`;
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
          color="primary"
          variant="contained"
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
          hasUserVoteResults={false}
        />
      </div>
    </>
  );
};

export default ProposeLawScreen;
