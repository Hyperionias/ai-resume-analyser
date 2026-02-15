import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";

export const meta = () =>([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account'},
])

const Auth = () => {
    const { auth } = usePuterStore();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) {
            navigate(next || '/');
        }
    }, [auth.isAuthenticated, next, navigate])

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await auth.signIn();
        } finally {
            setIsSigningIn(false);
        }
    };

    return(
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome</h1>
                    <h2 className="text-lg text-gray-600">Log In to Continue Your Job Journey</h2>
                    
                    <button
                        onClick={handleSignIn}
                        disabled={isSigningIn}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isSigningIn ? 'Loading...' : 'Log In'}
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Auth