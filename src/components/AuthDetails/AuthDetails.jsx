import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from '../../firebase';

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setAuthUser(null);
        } catch (error) {
            console.error("Sign out error:", error.message);
        }
    };

    return (
        <div>
            {authUser ? (
                <div>
                    <p>{`Signed in as ${authUser.email}`}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>Signed Out</p>
            )}
        </div>
    );
};

export default AuthDetails;
