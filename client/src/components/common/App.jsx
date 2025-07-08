import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from '../../../MainRouter';
const App = () => {
  return (
    <Router>

      <MainRouter />
      <footer style={{ marginTop: "20px", padding: "4px", textAlign: "center", color: "#888" , fontSize: "12px"}}>
        © 2025 Centennial College | Bright Bridge | COMP 229 | Fall 2025 | All rights reserved.
      </footer>
    </Router>
  );
};
export default App;
