
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import App from './App';
import Dash from './Dash';


function Wel() {
  return (
      <Home />
  );
}

export default Wel;


/*
<Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/app">About</Link>
            </li>
            <li>
              <Link to="/Dash">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<App />} />
          <Route path="/contact" element={<Dash />} />
        </Routes>
      </div>
    </Router>
    */