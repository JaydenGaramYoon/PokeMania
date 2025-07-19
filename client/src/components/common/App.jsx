import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from '../../../MainRouter';
const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <MainRouter />
        </div>
        <footer style={{
          marginTop: "10%",
          padding: "4px",
          textAlign: "center",
          color: "#888",
          fontSize: "12px",
        }}>
          © 2025 Centennial College | Bright Bridge | COMP 229 | Fall 2025 | All rights reserved.
        </footer>
      </div>
    </Router>
  );
};
export default App;
