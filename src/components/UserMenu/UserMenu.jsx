import { useState } from "react";
import { AuthForm } from "../AuthForm/AuthForm";
import { Modal } from "../Modal/Modal";
import css from "./UserMenu.module.css";

export default function UserMenu() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleRegister = (data) => {
        console.log("Registration", data);
        setIsRegisterOpen(false); // Закриваємо модалку після відправки
    };

    const handleLogin = (data) => {
        console.log("Login", data);
        setIsLoginOpen(false); // Закриваємо модалку після відправки
    };

    return (
        <>
            <nav className={css.userMenu}>
                <svg className={css.iconLogin} aria-hidden="true" width="16" height="16">
                    <use href="/icons.svg#icon-log-in-01" />
                </svg>

                <button className={css.loginBtn} type="button" onClick={() => setIsLoginOpen(true)}>
                    Log in
                </button>

                <button className={css.registrationBtn} type="button" onClick={() => setIsRegisterOpen(true)}>
                    Registration
                </button>
            </nav>

            {/* Модальне вікно для логіну */}
            {isLoginOpen && (
                <Modal className={css.login} onClose={() => setIsLoginOpen(false)}>
                    <h2 className={css.loginTitle}>Login</h2>
                    <p className={css.loginText}>Welcome back! Please enter your credentials to access your
                        account and continue your search for an teacher.</p>
                    <AuthForm onSubmit={handleLogin} />
                </Modal>
            )}

            {/* Модальне вікно для реєстрації */}
            {isRegisterOpen && (
                <Modal className={css.registration} onClose={() => setIsRegisterOpen(false)}>
                    <h2 className={css.registrationTitle}>Registration</h2>
                    <p className={css.registrationText}>Thank you for your interest in our platform! In order to register, we
                        need some information. Please provide us with the following
                        information</p>
                    <AuthForm isRegister onSubmit={handleRegister} />
                </Modal>
            )}
        </>
    );
}

