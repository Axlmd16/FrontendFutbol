import { Link, NavLink } from 'react-router-dom';

function NavbarPublic() {
    return (
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SportTrack
                </Link>
            </div>
            <div className="navbar-end gap-2">
                <Link to="#features" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                    Características
                </Link>
                <Link to="/auth/login" className="btn btn-primary btn-sm">
                    Acceder
                </Link>
            </div>
        </div>
    );
}

export default NavbarPublic;