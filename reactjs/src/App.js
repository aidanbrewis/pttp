import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles'
import Theme from "./theme/theme";
import Home from "./screens/Home/Home";
import Screen2 from "./screens/Screen2/Screen2.jsx";
import { Amplify, Auth } from 'aws-amplify';
import { awsExports } from "./aws-exports";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID
  }
})
  
function App() {
  const [jwtToken, setJwtToken] = useState('');
  useEffect(() => {
    fetchJwtToken();
  }, []);
  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  return (
    <Authenticator>
      {( {signOut, user} ) => (<div className="App">
        <ThemeProvider theme={Theme}>
          <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Screen2" element={<Screen2 />} />
            </Routes>
          </Router>
        </ThemeProvider>
        <button onClick={signOut}>Sign out</button>
      </div>)}
    </Authenticator>
  );
}
  
export default App