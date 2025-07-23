import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Check if link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    // Check if current page is home
    const isHomePage = () => {
        return location.pathname === '/home' || location.pathname === '/';
    };

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
                        <Link to="/home" className={`nav-link ${isHomePage() ? 'active' : ''}`}>
                            <img src="/images/appLogo.PNG" alt="appLogo" />
                        </Link>
                    </div>

                    <div className="nav-links">
                        <Link to="/favourites" className={`nav-link ${isActiveLink('/favourites') ? 'active' : ''}`}>Favourites</Link>
                        <Link to="/game" className={`nav-link ${isActiveLink('/game') ? 'active' : ''}`}>Game</Link>
                        <Link to="/talktalk" className={`nav-link ${isActiveLink('/talktalk') ? 'active' : ''}`}>TalkTalk</Link>

                        {/* 👤 Show user name if logged in */}
                        {isLoggedIn && user && (
                           <Link to="/profile" className={`nav-link ${isActiveLink('/profile') ? 'active' : ''}`}>👋 {user.name}</Link>
                        )}

                        {isLoggedIn ? (
                            <Link
                                to="#"
                                className="nav-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                            >
                                Logout
                            </Link>
                        ) : (
                            <Link to="/login" className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}>Login</Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
