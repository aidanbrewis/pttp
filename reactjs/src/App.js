import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import { Amplify } from "aws-amplify";
import awsExports from "./awsExports.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import ProposeLawScreen from "./screens/ProposeLawScreen/ProposeLawScreen";
import AcceptedLawsScreen from "./screens/AcceptedLawsScreen/AcceptedLawsScreen";
import RejectedLawsScreen from "./screens/RejectedLawsScreen/RejectedLawsScreen";
import VotedLawsScreen from "./screens/VotedLawsScreen/VotedLawsScreen";
import LawScreen from "./screens/LawScreen/LawScreen";
import { Button, Link } from "@material-ui/core";
import styles from "./screens/HomeScreen/HomeScreen.styles";
import settings from "./settings.json";
import languages from "./labels.json";

function App() {
  const labels = languages[settings.language];

  Amplify.configure({
    Auth: {
      region: awsExports.REGION,
      userPoolId: awsExports.USER_POOL_ID,
      userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID,
    },
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#6a1b9a",
      },
      yes: {
        main: "#2e7d32",
        dark: "#1b5e20",
        contrastText: "#fafafa",
      },
      no: {
        main: "#d32f2f",
        dark: "#c62828",
        contrastText: "#fafafa",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="roboto">
            <Router>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/propose_law" element={<ProposeLawScreen />} />
                <Route path="/accepted_laws" element={<AcceptedLawsScreen />} />
                <Route path="/rejected_laws" element={<RejectedLawsScreen />} />
                <Route path="/voted_laws" element={<VotedLawsScreen />} />
                <Route
                  path="/:lawId/amend"
                  element={<LawScreen amend={true} />}
                />
                <Route path="/:lawId" element={<LawScreen amend={false} />} />
              </Routes>
            </Router>
            <div style={styles.tabs}>
              <div style={{ marginRight: "auto" }}>
                <Button color="inherit" variant="contained" onClick={signOut}>
                  {labels.signOut}
                </Button>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Button color="inherit" variant="contained">
                  <Link
                    target="_blank"
                    href="https://github.com/aidanbrewis/pttp"
                    rel="noreferrer"
                  >
                    {labels.sourceCode}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
