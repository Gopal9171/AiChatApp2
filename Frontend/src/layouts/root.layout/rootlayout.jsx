import './rootlayout.css';
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
}
//create a client
const queryClient = new QueryClient()
const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <QueryClientProvider client={queryClient}>
                <div className="rootlayout">
                    <header>
                        <Link to="/" className='logo'>
                            <img src="/logo.png" alt="Logo" />
                            <span>GAMA AI</span>
                        </Link>
                        <div className="user">
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </QueryClientProvider>
        </ClerkProvider>
    );
};

export default RootLayout;
