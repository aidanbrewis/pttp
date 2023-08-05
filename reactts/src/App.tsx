import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home/Home'
import Deeper from './screens/Deeper/Deeper'
function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
        <Routes>
            <Route path="/" element={<Home />}  />
            <Route path="/nextLevel" element={<Deeper />} />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;