import { Link } from 'react-router-dom';
import './Layout.css'; // Assuming you have a CSS file for styling
export default function Layout() {


    return (
        <div className="layout">
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
                        <Link to="/" className="nav-link">
                            <img src="/images/appLogo.PNG" alt="appLogo" />
                        </Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/favourites" className="nav-link">Favourites</Link>
                        <Link to="/game" className="nav-link">Game</Link>
                        <Link to="/talktalk" className="nav-link">TalkTalk</Link>
                        <Link to="/profile" className="nav-link">
                            <img src="/images/profile.png" alt="profile" />
                        </Link>

                    </div>
                </div>
            </nav>
        </div>

    );
}
