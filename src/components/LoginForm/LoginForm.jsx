import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from '../AuthModal/authSchema';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import css from './LoginForm.module.css';

const LoginForm = ({ onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(authSchema),
        defaultValues: { email: "", password: "" },
    });

    const login = async (data) => {
        console.log("Logging in with:", data);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
            console.log("User logged in:", userCredential.user);
            reset();

            if (onSubmit) {
                onSubmit(userCredential.user);
            }
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "This email is not registered. Please try registering.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email format.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                default:
                    errorMessage = "Login failed. Please try again.";
            }
            console.error("Login error:", error.code, error.message);
            setError(errorMessage);
        }
    }
  
    return (
        <form onSubmit={handleSubmit(login)} className={css.authForm} autoComplete="on">
            <div>
                {errors.email && <p className={css.errors}>{errors.email.message}</p>}
                <input
                    {...register("email")}
                    className={css.emailForm}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"  
                />
            </div>
            <div className={css.inputWrapper}>
                {errors.password && <p className={css.errors}>{errors.password.message}</p>}
                <input
                    {...register("password")}
                    className={css.passwordForm}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"  
                />
                <svg
                    className={css.iconEye}
                    aria-hidden="true"
                    width="16"
                    height="16"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    <use href={`/icons.svg#icon-eye${showPassword ? "" : "-off"}`} />
                </svg>
            </div>
            <button className={css.buttonForm} type="submit">Login</button>
            {error && <p className={css.errors}>{error}</p>}
        </form>
    );
};

export default LoginForm;


