import { useState, useEffect } from "react";
import { AuthModal } from "../AuthModal/AuthModal";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import { auth } from "../../firebase";
import css from "./UserMenu.module.css";

export default function UserMenu() {
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    const handleRegister = async (email, password) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully");
            navigate('/teachers');
        } catch (error) {
            console.error("Registration error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setError("This email is already in use. Please log in.");
            }
        }
    };

    const handleLogin = async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            navigate('/teachers');  
        } catch (error) {
            console.error("Login error:", error);
            if (error.code === 'auth/user-not-found') {
                setError("This user doesn't exist. Please register first.");
            } else if (error.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully");
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    return (
        <>
            <nav className={css.userMenu}>
             {user ? (
                    <div className={css.wrapper}>
                        <p>Welcome, {user.email}!</p>
                        <button className={css.logout} type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <svg className={css.iconLogin} aria-hidden="true" width="16" height="16">
                                <use href="/icons.svg#icon-log-in-01" />
                        </svg>
                        <button className={css.loginBtn} type="button" onClick={() => setIsLoginOpen(true)}>
                            Log in
                        </button>

                        <button className={css.registrationBtn} type="button" onClick={() => setIsRegisterOpen(true)}>
                            Registration
                        </button>
                    </>
                )}
            </nav>

            {isLoginOpen && (
                <AuthModal className={css.login} onClose={() => setIsLoginOpen(false)}>
                    <h2 className={css.loginTitle}>Login</h2>
                    <p className={css.loginText}>Welcome back! Please enter your credentials to access your account and continue your search for a teacher.</p>
                    {error && <p className={css.errorText}>{error}</p>}
                    <LoginForm onSubmit={handleLogin} />
                </AuthModal>
            )}

            {isRegisterOpen && (
                <AuthModal className={css.registration} onClose={() => setIsRegisterOpen(false)}>
                    <h2 className={css.registrationTitle}>Registration</h2>
                    <p className={css.registrationText}>Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.</p>
                    {error && <p className={css.errorText}>{error}</p>}
                    <RegistrationForm onSubmit={handleRegister} />
                </AuthModal>
            )}
        </>
    );
}


