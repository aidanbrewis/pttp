import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles'
import Theme from "./theme/theme";
import Home from "./screens/Home/Home";
import Screen2 from "./screens/Screen2/Screen2.jsx";
  
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={Theme}>
        <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Screen2" element={<Screen2 />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}
  
export default App