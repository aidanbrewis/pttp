import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import Theme from "./theme/theme";
import Home from "./screens/Home/Home";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

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
          <ThemeProvider theme={Theme}>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Router>
          </ThemeProvider>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
