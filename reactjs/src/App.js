import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import Theme from "./theme/theme";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import ProposeLawScreen from "./screens/ProposeLawScreen/ProposeLawScreen";
import AcceptedLawsScreen from "./screens/AcceptedLawsScreen/AcceptedLawsScreen";
import RejectedLawsScreen from "./screens/RejectedLawsScreen/RejectedLawsScreen";
import VotedLawsScreen from "./screens/VotedLawsScreen/VotedLawsScreen";
import LawScreen from "./screens/LawScreen/LawScreen";
import { Button } from "@material-ui/core";
import styles from "./screens/HomeScreen/HomeScreen.styles";

function App() {
  Amplify.configure({
    Auth: {
      region: awsExports.REGION,
      userPoolId: awsExports.USER_POOL_ID,
      userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID,
    },
  });

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
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
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
