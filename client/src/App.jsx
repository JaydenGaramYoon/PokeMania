import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import MainRouter from '../MainRouter';

const AppContent = () => {
  const location = useLocation();

  // 判断当前页面是不是 profile 或 favourites
  const isProfileOrFavourites = (
    location.pathname === '/profile' ||
    location.pathname === '/favourites'
  );

  return (
    <>
      <MainRouter />
      {/* 只在非 profile 非 favourites 页面显示 footer */}
      {!isProfileOrFavourites && (
        <footer className="app-footer" style={{
          marginTop: "20px",
          padding: "4px",
          textAlign: "center",
          color: "#888",
          fontSize: "12px"
        }}>
          © 2025 Centennial College | Bright Bridge | COMP 229 | Fall 2025 | All rights reserved.
        </footer>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
