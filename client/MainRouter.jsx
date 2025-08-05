// import React, { useEffect } from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';
// import Home from './src/components/Home/Home';
// import Layout from './src/components/Layout/Layout';
// import Favourites from './src/components/Favourites/Favourites';
// import Talktalk from './src/components/Talktalk/Talktalk';
// import Game from './src/components/Game/Game';
// import Login from './src/components/Login/Login';
// import Profile from './src/components/Profile/Profile';
// import ProtectedRoute from './src/components/ProtectedRoute.jsx'; // ✅ import 추가

// const MainRouter = () => {
//   const token = localStorage.getItem('token');
//   const location = useLocation();
//   const isLoggedIn = !!token;
//   const isLoginPage = location.pathname === '';

//   // ✅ Clear token on page close/refresh
//   useEffect(() => {
//     const handleUnload = () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     };
//     window.addEventListener('beforeunload', handleUnload);
//     return () => window.removeEventListener('beforeunload', handleUnload);
//   }, []);

// //  // 🔐 Not logged in → always go to login
// //   if (!isLoggedIn) {
// //     return (
// //       <Routes>
// //         <Route path="*" element={<Login />} />
// //       </Routes>
// //     );
// //   }

//   // ✅ Logged in → show app
//   return (
//     <div>
//       <Layout />
//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/favourites" element={<Favourites />} />
//           <Route path="/talktalk" element={<Talktalk />} />
//           <Route path="/game" element={<Game />} />
//           <Route path="/login" element={<Login />} />
//             <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />

//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default MainRouter;

import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './src/components/Home/Home';
import Layout from './src/components/Layout/Layout';
import Favourites from './src/components/Favourites/Favourites';
import Talktalk from './src/components/Talktalk/Talktalk';
import Game from './src/components/Game/Game';
import Login from './src/components/Login/Login';
import Profile from './src/components/Profile/Profile';
import ProtectedRoute from './ProtectedRoute'; 

const MainRouter = () => {
  const location = useLocation();
//  delete token and user from localStorage on page close/refresh
  useEffect(() => {
    const handleUnload = (event) => {
      // 브라우저/탭 닫기일 때만 토큰 삭제 (새로고침은 삭제하지 않음)
      if (event.type === 'unload') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };
    window.addEventListener('unload', handleUnload);
    return () => window.removeEventListener('unload', handleUnload);
  }, []);


  return (
    <div>
      <Layout />
      <main>
        <Routes>
          {/* without login */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/talktalk" element={<Talktalk />} />
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />

          {/* with login */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default MainRouter;
