import { React, useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import styles from "./ProposeLawScreen.styles";
import { useNavigate } from "react-router-dom";
import proposeLaw from "../../api/proposeLaw";
import { Auth } from "aws-amplify";

const ProposeLawScreen = () => {
  const [lawTitle, setLawTitle] = useState("");
  const [lawContent, setLawContent] = useState("");
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
    } catch (error) {
      throw Error("Error fetching JWT token:", error);
    }
  };

  let navigate = useNavigate();

  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };

  const handleChange = (e) => {
    switch (e.target.id) {
      case "law-title":
        setLawTitle(e.target.value);
        break;
      case "law-content":
        setLawContent(e.target.value);
    }
  };

  const callProposeLaw = async () => {
    const result = await proposeLaw(
      username,
      jwtToken,
      lawContent,
      lawTitle,
      "",
      false,
      null
    );
    if (result.errorMessage) {
      throw Error(result.errorMessage);
    }
    routeChange();
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
        <TextField
          id="law-title"
          label="Title"
          value={lawTitle}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          id="law-content"
          label="Law"
          value={lawContent}
          onChange={handleChange}
          margin="normal"
        />
        <div style={styles.proposalButton}>
          <Button color="inherit" variant="contained" onClick={callProposeLaw}>
            Propose Law
          </Button>
        </div>
        <div style={styles.proposalButton}>
          <Button color="inherit" variant="contained" onClick={routeChange}>
            Back
          </Button>
        </div>
      </div>
      ;
    </>
  );
};

export default ProposeLawScreen;
