import { React, useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import styles from "./ProposeLawScreen.styles";
import { useNavigate } from "react-router-dom";
import proposeLaw from "../../api/proposeLaw";
import { Auth } from "aws-amplify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple, pink } from "@mui/material/colors";

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
    homeScreenNavigate();
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
          backgroundColor: "rgb(248,203,214)",
          justifyContent: "center",
          alignSelf: "center",
          overflow: "hidden",
          maxWidth: "80%",
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
      </div>
    </>
  );
};

export default ProposeLawScreen;
