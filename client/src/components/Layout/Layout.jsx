import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };


    return (
        <div className="layout">
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
                        <Link to="/home" className="nav-link">
                            <img src="/images/appLogo.PNG" alt="appLogo" />
                        </Link>

                    </div>

                    <div className="nav-links">
                        <Link to="/favourites" className="nav-link">Favourites</Link>
                        <Link to="/game" className="nav-link">Game</Link>
                        <Link to="/talktalk" className="nav-link">TalkTalk</Link>

                        {/* 👤 Show user name if logged in */}
                        {isLoggedIn && user && (
                            <span className="nav-link">👋 {user.name}</span>
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
                            <Link to="/login" className="nav-link">Login</Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
