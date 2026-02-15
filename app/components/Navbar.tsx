import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState} from "react";


const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await auth.signOut();
            navigate('/auth');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gardient">
                    RESUMIND
                </p>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/">
                    Upload Resume
                </Link>
                {auth.isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? 'Logging out...' : 'Log Out'}
                    </button>
                )}
            </div>
        </nav>
    )
}
export default Navbar