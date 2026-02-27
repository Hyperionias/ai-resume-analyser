import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { auth, puterReady, error } = usePuterStore();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next || '/');
        }
    }, [auth.isAuthenticated, next, navigate])

    const handleSignIn = async () => {
        setLocalError(null);
        setIsSigningIn(true);
        try {
            console.log('Puter ready:', puterReady, 'window.puter:', typeof window !== 'undefined' ? !!window.puter : 'SSR');
            await auth.signIn();
        } catch (err) {
            console.error('Sign in error:', err);
            setLocalError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const displayError = localError || error;

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4">
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome</h1>
                    <h2 className="text-lg text-gray-600">Log In to Continue Your Job Journey</h2>

                    {displayError && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            {displayError}
                        </div>
                    )}

                    {!puterReady && (
                        <p className="text-sm text-gray-400">Loading Puter.js…</p>
                    )}

                    <button
                        onClick={handleSignIn}
                        disabled={isSigningIn || !puterReady}
                        className="w-full primary-gradient text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover:opacity-90"
                    >
                        {isSigningIn ? 'Opening login window…' : !puterReady ? 'Loading…' : 'Log In'}
                    </button>

                    <p className="text-xs text-gray-400">
                        A Puter.com login window will open. Please allow popups for this site if prompted.
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Auth
